package securityaudit

import (
	"context"
	"errors"
	"sync"
	"sync/atomic"
	"time"
)

type WorkerRuntime struct {
	active           atomic.Int64
	processed        atomic.Int64
	failed           atomic.Int64
	heartbeatNS      atomic.Int64
	lastProcessedNS  atomic.Int64
	lastErrorMu      sync.RWMutex
	lastErrorCode    string
	lastErrorMessage string
}

type Runner struct {
	config  ConfigStore
	repo    JobRepository
	payload PayloadStore
	scanner PromptScanner
	metrics Metrics
	clock   Clock
	runtime WorkerRuntime

	mu     sync.Mutex
	cancel context.CancelFunc
	wg     sync.WaitGroup

	workerMu        sync.Mutex
	workerHandles   map[int]*runnerWorkerHandle
	reclaimerCancel context.CancelFunc
}

type runnerWorkerHandle struct {
	retire   context.CancelFunc
	retiring bool
}

func NewRunner(config ConfigStore, repo JobRepository, payload PayloadStore, scanner PromptScanner, metrics Metrics) *Runner {
	return &Runner{
		config: config, repo: repo, payload: payload, scanner: scanner, metrics: metrics, clock: realClock{},
		workerHandles: make(map[int]*runnerWorkerHandle),
	}
}

func (r *Runner) Start(ctx context.Context) error {
	if r == nil || r.config == nil || r.repo == nil || r.payload == nil || r.scanner == nil {
		return errors.New("prompt audit worker dependencies unavailable")
	}
	r.mu.Lock()
	if r.cancel != nil {
		r.mu.Unlock()
		return nil
	}
	if ctx == nil {
		ctx = context.Background()
	}
	runCtx, cancel := context.WithCancel(ctx)
	r.cancel = cancel
	r.mu.Unlock()
	r.wg.Add(1)
	go r.supervise(runCtx)
	return nil
}

func (r *Runner) Shutdown(ctx context.Context) error {
	if r == nil {
		return nil
	}
	r.mu.Lock()
	cancel := r.cancel
	r.cancel = nil
	r.mu.Unlock()
	if cancel != nil {
		cancel()
	}
	done := make(chan struct{})
	go func() { r.wg.Wait(); close(done) }()
	select {
	case <-done:
		return nil
	case <-ctx.Done():
		LogWarn(EventProcessFailed, map[string]any{"status": "shutdown_timeout", "error_code": "worker_shutdown_timeout"})
		return ctx.Err()
	}
}

func (r *Runner) worker(serviceCtx, workerCtx context.Context, workerID int, handle *runnerWorkerHandle) {
	defer func() {
		r.workerExited(workerID, handle)
		r.wg.Done()
		if serviceCtx.Err() == nil {
			r.reconcileWorkers(serviceCtx)
		}
	}()
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()
	for {
		select {
		case <-workerCtx.Done():
			return
		case <-ticker.C:
			r.runtime.heartbeatNS.Store(r.clock.Now().UnixNano())
			cfg, ok := r.config.Active()
			if !ok || cfg.EffectiveMode() != ModeAsync || workerID >= cfg.WorkerCount {
				continue
			}
			for {
				select {
				case <-workerCtx.Done():
					return
				default:
				}
				current, active := r.config.Active()
				if !active || current.EffectiveMode() != ModeAsync || workerID >= current.WorkerCount {
					break
				}
				cfg = current
				job, claimed, err := r.repo.ClaimNextJob(workerCtx, r.clock.Now())
				if err != nil {
					if workerCtx.Err() != nil {
						return
					}
					r.setLastError("claim_job_failed", err.Error())
					break
				}
				if !claimed {
					break
				}
				r.runtime.active.Add(1)
				r.processSafely(serviceCtx, workerID, cfg, job)
				r.runtime.active.Add(-1)
			}
		}
	}
}

func (r *Runner) supervise(ctx context.Context) {
	defer r.wg.Done()
	defer r.resizeWorkers(ctx, 0)

	r.reconcileWorkers(ctx)
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			r.reconcileWorkers(ctx)
		}
	}
}

func (r *Runner) reconcileWorkers(ctx context.Context) {
	desired := 0
	if cfg, ok := r.config.Active(); ok && cfg.EffectiveMode() == ModeAsync {
		desired = cfg.WorkerCount
		if desired < 1 {
			desired = DefaultWorkerCount
		}
		if desired > MaxWorkerCount {
			desired = MaxWorkerCount
		}
	}
	r.resizeWorkers(ctx, desired)
}

func (r *Runner) resizeWorkers(ctx context.Context, desired int) {
	r.workerMu.Lock()
	defer r.workerMu.Unlock()

	for workerID, handle := range r.workerHandles {
		if workerID >= desired && !handle.retiring {
			handle.retiring = true
			handle.retire()
		}
	}
	if desired == 0 {
		if r.reclaimerCancel != nil {
			r.reclaimerCancel()
			r.reclaimerCancel = nil
		}
		return
	}
	if ctx.Err() != nil {
		return
	}
	if len(r.workerHandles) == 0 {
		if err := r.payload.Ping(ctx); err != nil {
			r.setLastError("payload_store_unavailable", err.Error())
		}
	}
	for workerID := 0; workerID < desired; workerID++ {
		if _, exists := r.workerHandles[workerID]; exists {
			continue
		}
		workerCtx, cancel := context.WithCancel(ctx)
		handle := &runnerWorkerHandle{retire: cancel}
		r.workerHandles[workerID] = handle
		r.wg.Add(1)
		go r.worker(ctx, workerCtx, workerID, handle)
	}
	if r.reclaimerCancel == nil {
		reclaimerCtx, cancel := context.WithCancel(ctx)
		r.reclaimerCancel = cancel
		r.wg.Add(1)
		go r.reclaimer(reclaimerCtx)
	}
}

func (r *Runner) workerExited(workerID int, handle *runnerWorkerHandle) {
	r.workerMu.Lock()
	defer r.workerMu.Unlock()
	if r.workerHandles[workerID] == handle {
		delete(r.workerHandles, workerID)
	}
}

func (r *Runner) workerTotal() int {
	if r == nil {
		return 0
	}
	r.workerMu.Lock()
	defer r.workerMu.Unlock()
	return len(r.workerHandles)
}

func (r *Runner) processSafely(ctx context.Context, workerID int, cfg ActiveConfig, job *Job) {
	defer func() {
		if recovered := recover(); recovered != nil {
			r.runtime.failed.Add(1)
			// Panic values may contain scanner response fragments or prompt data.
			// Keep only a stable generic message in runtime state and logs.
			r.setLastError("worker_panic", "worker panic recovered")
			_ = r.repo.Fail(ctx, job.ID, job.ClaimVersion, "worker_panic", "worker panic recovered")
			LogError(EventProcessFailed, mergeLogFields(jobLogFields(job), map[string]any{"worker_id": workerID, "status": "failed", "error_code": "worker_panic"}))
		}
	}()
	if err := r.processJob(ctx, workerID, cfg, job); err != nil {
		r.runtime.failed.Add(1)
	} else {
		r.runtime.processed.Add(1)
		r.runtime.lastProcessedNS.Store(r.clock.Now().UnixNano())
	}
}

func (r *Runner) processJob(ctx context.Context, workerID int, cfg ActiveConfig, job *Job) error {
	baseFields := jobLogFields(job)
	LogInfo(EventAuditStarted, mergeLogFields(baseFields, map[string]any{"worker_id": workerID, "attempts": job.Attempts, "status": "processing"}))
	scanText, err := r.payload.Get(ctx, job.ID)
	if err != nil {
		return r.finishFailure(ctx, job, &GuardError{Code: "payload_missing", Retryable: false, Cause: err})
	}
	// The job row only carries redacted metadata; the full prompt for the audit
	// event is reconstructed here from the transient scan payload.
	job.Snapshot.FullPrompt = FullPromptFromScanText(scanText)
	endpoints := cfg.EnabledEndpoints()
	if len(endpoints) == 0 {
		return r.finishFailure(ctx, job, &GuardError{Code: "no_enabled_endpoint", Retryable: true})
	}
	chunks := SplitRunes(scanText, minimumInputLimit(endpoints))
	results := make([]*NormalizedResult, 0, len(chunks))
	started := r.clock.Now()
	for index, chunk := range chunks {
		if err := r.repo.RefreshLease(ctx, job.ID, job.ClaimVersion, r.clock.Now()); err != nil {
			return err
		}
		chunkStarted := r.clock.Now()
		LogInfo(EventChunkStarted, mergeLogFields(baseFields, map[string]any{"worker_id": workerID, "chunk_index": index + 1, "chunk_total": len(chunks), "chunk_chars": len([]rune(chunk)), "input_chars": job.Snapshot.PromptLength, "input_limit": minimumInputLimit(endpoints), "status": "started"}))
		result, scanErr := scanWithFailover(ctx, r.scanner, cfg.Scanners, endpoints, chunk, r.metrics)
		if scanErr != nil {
			LogWarn(EventChunkFailed, mergeLogFields(baseFields, map[string]any{
				"worker_id": workerID, "chunk_index": index + 1, "chunk_total": len(chunks),
				"chunk_chars": len([]rune(chunk)), "input_chars": job.Snapshot.PromptLength,
				"input_limit": minimumInputLimit(endpoints), "latency_ms": r.clock.Now().Sub(chunkStarted).Milliseconds(),
				"error_code": guardErrorCode(scanErr), "status": "failed",
			}))
			r.observeAsyncFailure(scanErr, r.clock.Now().Sub(started))
			return r.finishFailure(ctx, job, scanErr)
		}
		results = append(results, result)
		LogInfo(EventChunkCompleted, mergeLogFields(baseFields, map[string]any{"worker_id": workerID, "chunk_index": index + 1, "chunk_total": len(chunks), "guard_endpoint_id": result.GuardEndpointID, "action": result.Action, "latency_ms": r.clock.Now().Sub(chunkStarted).Milliseconds(), "status": "completed"}))
		if result.Action == ActionBlock {
			break
		}
	}
	aggregated, err := AggregateResults(results, r.clock.Now().Sub(started))
	if err != nil {
		if r.metrics != nil {
			r.metrics.Observe(DecisionInvalid, r.clock.Now().Sub(started))
		}
		return r.finishFailure(ctx, job, &GuardError{Code: ErrorCodeInvalidResponse, Cause: err})
	}
	aggregated.ChunkTotal = len(chunks)
	if r.metrics != nil {
		r.metrics.Observe(decisionKindForResult(aggregated), r.clock.Now().Sub(started))
	}
	LogInfo(EventChunksAggregated, mergeLogFields(baseFields, map[string]any{
		"worker_id": workerID, "decision": aggregated.Decision, "risk_level": aggregated.RiskLevel,
		"action": aggregated.Action, "chunk_total": aggregated.ChunkTotal,
		"latency_ms": aggregated.LatencyMS, "guard_endpoint_id": aggregated.GuardEndpointID, "status": "completed",
	}))
	event, err := r.repo.Complete(ctx, job, aggregated, cfg.StorePassEvents)
	if err != nil {
		return err
	}
	if deleteErr := r.payload.Delete(ctx, job.ID); deleteErr != nil {
		LogWarn(EventProcessFailed, mergeLogFields(baseFields, map[string]any{"worker_id": workerID, "status": "payload_delete_deferred", "error_code": "payload_delete_failed"}))
	}
	LogInfo(EventProcessed, mergeLogFields(baseFields, map[string]any{"worker_id": workerID, "event_id": eventID(event), "decision": aggregated.Decision, "risk_level": aggregated.RiskLevel, "action": aggregated.Action, "guard_endpoint_id": aggregated.GuardEndpointID, "latency_ms": aggregated.LatencyMS, "status": "done"}))
	if event != nil && aggregated.Decision != EventPass {
		LogWarn(EventFindingRecorded, mergeLogFields(baseFields, map[string]any{"worker_id": workerID, "event_id": event.ID, "decision": aggregated.Decision, "risk_level": aggregated.RiskLevel, "action": aggregated.Action, "guard_endpoint_id": aggregated.GuardEndpointID, "status": "recorded"}))
	}
	return nil
}

func (r *Runner) observeAsyncFailure(err error, latency time.Duration) {
	if r == nil || r.metrics == nil {
		return
	}
	kind := DecisionUnavailable
	if guardErrorCode(err) == ErrorCodeInvalidResponse {
		kind = DecisionInvalid
	}
	r.metrics.Observe(kind, latency)
	var guardErr *GuardError
	if errors.As(err, &guardErr) && guardErr.Timeout {
		r.metrics.IncTimeout()
	}
}

func decisionKindForResult(result *NormalizedResult) DecisionKind {
	if result == nil {
		return DecisionInvalid
	}
	switch result.Action {
	case ActionBlock:
		return DecisionBlock
	case ActionWarn:
		return DecisionFlag
	default:
		return DecisionAllow
	}
}

func (r *Runner) finishFailure(ctx context.Context, job *Job, err error) error {
	baseFields := jobLogFields(job)
	code := guardErrorCode(err)
	retryable := false
	var guardErr *GuardError
	if errors.As(err, &guardErr) {
		retryable = guardErr.Retryable
	}
	if retryable && job.Attempts < job.MaxAttempts {
		next := r.clock.Now().Add(retryBackoff(job.Attempts))
		if updateErr := r.repo.Retry(ctx, job.ID, job.ClaimVersion, next, code, "prompt guard temporarily unavailable"); updateErr != nil {
			return updateErr
		}
		LogWarn(EventProcessFailed, mergeLogFields(baseFields, map[string]any{"attempts": job.Attempts, "max_attempts": job.MaxAttempts, "status": "retry", "error_code": code, "retryable": true}))
	} else {
		if updateErr := r.repo.Fail(ctx, job.ID, job.ClaimVersion, code, "prompt guard processing failed"); updateErr != nil {
			return updateErr
		}
		_ = r.payload.Delete(ctx, job.ID)
		LogError(EventProcessFailed, mergeLogFields(baseFields, map[string]any{"attempts": job.Attempts, "max_attempts": job.MaxAttempts, "status": "failed", "error_code": code, "retryable": false}))
	}
	r.setLastError(code, err.Error())
	return err
}

func (r *Runner) reclaimer(ctx context.Context) {
	defer r.wg.Done()
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			now := r.clock.Now()
			count, err := r.repo.ReclaimStale(ctx, now.Add(-2*time.Minute), now.Add(-90*time.Second), 100)
			if err != nil {
				r.setLastError("reclaim_failed", err.Error())
				continue
			}
			if count > 0 {
				LogWarn(EventProcessingReclaimed, map[string]any{"reclaimed_total": count, "status": "reclaimed"})
			}
		}
	}
}

func (r *Runner) Snapshot() (active, processed, failed int64, heartbeat, lastProcessed *time.Time, code, message string) {
	if r == nil {
		return
	}
	active, processed, failed = r.runtime.active.Load(), r.runtime.processed.Load(), r.runtime.failed.Load()
	if ns := r.runtime.heartbeatNS.Load(); ns > 0 {
		value := time.Unix(0, ns).UTC()
		heartbeat = &value
	}
	if ns := r.runtime.lastProcessedNS.Load(); ns > 0 {
		value := time.Unix(0, ns).UTC()
		lastProcessed = &value
	}
	r.runtime.lastErrorMu.RLock()
	code, message = r.runtime.lastErrorCode, r.runtime.lastErrorMessage
	r.runtime.lastErrorMu.RUnlock()
	return
}

func (r *Runner) setLastError(code, _ string) {
	code, message := sanitizeStoredError(code)
	r.runtime.lastErrorMu.Lock()
	r.runtime.lastErrorCode = code
	r.runtime.lastErrorMessage = message
	r.runtime.lastErrorMu.Unlock()
}

func scanWithFailover(ctx context.Context, scanner PromptScanner, scanners []string, endpoints []ActiveEndpoint, chunk string, metrics Metrics) (*NormalizedResult, error) {
	var lastErr error
	for index, endpoint := range endpoints {
		result, err := scanner.Scan(ctx, endpoint, chunk, scanners)
		if err == nil && result != nil {
			return result, nil
		}
		if err == nil {
			err = &GuardError{Code: ErrorCodeInvalidResponse, Retryable: false}
		}
		lastErr = err
		var guardErr *GuardError
		if !errors.As(err, &guardErr) || !guardErr.Retryable {
			return nil, err
		}
		if index < len(endpoints)-1 && metrics != nil {
			metrics.IncFailover()
		}
	}
	if lastErr == nil {
		lastErr = &GuardError{Code: ErrorCodeUnavailable}
	}
	return nil, lastErr
}

func retryBackoff(attempt int) time.Duration {
	switch attempt {
	case 1:
		return 5 * time.Second
	case 2:
		return 30 * time.Second
	default:
		return 2 * time.Minute
	}
}

func eventID(event *Event) int64 {
	if event == nil {
		return 0
	}
	return event.ID
}
