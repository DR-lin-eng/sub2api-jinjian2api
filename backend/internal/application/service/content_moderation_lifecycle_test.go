package service

import (
	"context"
	"encoding/json"
	"sync"
	"testing"
	"time"
)

type blockingContentModerationRepo struct {
	contentModerationTestRepo
	started chan struct{}
	release chan struct{}
	once    sync.Once
}

type multiBlockingContentModerationRepo struct {
	contentModerationTestRepo
	started chan struct{}
	release chan struct{}
}

func (r *multiBlockingContentModerationRepo) CreateLog(ctx context.Context, log *ContentModerationLog) error {
	r.started <- struct{}{}
	select {
	case <-r.release:
	case <-ctx.Done():
		return ctx.Err()
	}
	return r.contentModerationTestRepo.CreateLog(ctx, log)
}

func (r *blockingContentModerationRepo) CreateLog(ctx context.Context, log *ContentModerationLog) error {
	r.once.Do(func() { close(r.started) })
	select {
	case <-r.release:
	case <-ctx.Done():
		return ctx.Err()
	}
	return r.contentModerationTestRepo.CreateLog(ctx, log)
}

func TestContentModerationServiceUsesConfiguredWorkersAndStops(t *testing.T) {
	cfg := defaultContentModerationConfig()
	cfg.Enabled = true
	cfg.Mode = ContentModerationModeObserve
	cfg.WorkerCount = 2
	raw, err := json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	service := NewContentModerationService(
		&contentModerationTestSettingRepo{values: map[string]string{
			SettingKeyRiskControlEnabled:      "true",
			SettingKeyContentModerationConfig: string(raw),
		}},
		&contentModerationTestRepo{},
		nil,
		nil,

		nil)

	workerCount := service.runtimeWorkerCount()
	if workerCount != 2 {
		t.Fatalf("expected 2 configured workers, got %d", workerCount)
	}

	service.Stop()
	service.Stop()
	workerCount = service.runtimeWorkerCount()
	if workerCount != 0 {
		t.Fatalf("expected all workers to stop, got %d", workerCount)
	}
	if !service.stopped.Load() {
		t.Fatal("service did not record stopped lifecycle state")
	}
}

func TestContentModerationServiceKeepsWorkersStoppedUntilEnabled(t *testing.T) {
	cfg := defaultContentModerationConfig()
	cfg.Enabled = true
	cfg.Mode = ContentModerationModeObserve
	cfg.WorkerCount = 2
	raw, err := json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	repo := &contentModerationTestSettingRepo{values: map[string]string{
		SettingKeyRiskControlEnabled:      "false",
		SettingKeyContentModerationConfig: string(raw),
	}}
	service := NewContentModerationService(repo, &contentModerationTestRepo{}, nil, nil, nil)
	t.Cleanup(service.Stop)

	workerCount := service.runtimeWorkerCount()
	if workerCount != 0 {
		t.Fatalf("disabled risk control started %d moderation workers", workerCount)
	}
	if service.asyncTaskQueue() != nil {
		t.Fatal("disabled risk control allocated the moderation queue")
	}

	repo.values[SettingKeyRiskControlEnabled] = "true"
	if _, err := service.refreshRuntimeSnapshot(context.Background()); err != nil {
		t.Fatal(err)
	}
	workerCount = service.runtimeWorkerCount()
	if workerCount != 2 {
		t.Fatalf("expected 2 moderation workers after enabling risk control, got %d", workerCount)
	}
	if service.asyncTaskQueue() == nil {
		t.Fatal("enabled risk control did not allocate the moderation queue")
	}

	repo.values[SettingKeyRiskControlEnabled] = "false"
	if _, err := service.refreshRuntimeSnapshot(context.Background()); err != nil {
		t.Fatal(err)
	}
	deadline := time.Now().Add(time.Second)
	for service.runtimeWorkerCount() != 0 && time.Now().Before(deadline) {
		time.Sleep(time.Millisecond)
	}
	workerCount = service.runtimeWorkerCount()
	if workerCount != 0 {
		t.Fatalf("expected workers to stop after disabling risk control, got %d", workerCount)
	}
}

func TestContentModerationDisableDrainsAcceptedRecordsBeforeStoppingWorkers(t *testing.T) {
	cfg := defaultContentModerationConfig()
	cfg.Enabled = true
	cfg.Mode = ContentModerationModeObserve
	cfg.WorkerCount = 1
	raw, err := json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	settings := &contentModerationTestSettingRepo{values: map[string]string{
		SettingKeyRiskControlEnabled:      "true",
		SettingKeyContentModerationConfig: string(raw),
	}}
	repo := &blockingContentModerationRepo{started: make(chan struct{}), release: make(chan struct{})}
	service := NewContentModerationService(settings, repo, nil, nil, nil)
	t.Cleanup(service.Stop)
	service.enqueueRecord(ContentModerationCheckInput{}, cfg, &ContentModerationLog{Action: ContentModerationActionBlock}, "hash", false, false)

	select {
	case <-repo.started:
	case <-time.After(time.Second):
		t.Fatal("accepted record did not start processing")
	}
	settings.values[SettingKeyRiskControlEnabled] = "false"
	if _, err := service.refreshRuntimeSnapshot(context.Background()); err != nil {
		t.Fatal(err)
	}
	if workers := service.runtimeWorkerCount(); workers != 1 {
		t.Fatalf("in-flight record lost its drain worker: %d", workers)
	}

	close(repo.release)
	deadline := time.Now().Add(time.Second)
	for service.runtimeWorkerCount() != 0 && time.Now().Before(deadline) {
		time.Sleep(time.Millisecond)
	}
	if workers := service.runtimeWorkerCount(); workers != 0 {
		t.Fatalf("drain worker did not stop: %d", workers)
	}
	repo.mu.Lock()
	defer repo.mu.Unlock()
	if len(repo.logs) != 1 {
		t.Fatalf("expected accepted record to persist, got %d", len(repo.logs))
	}
}

func TestContentModerationShrinkLetsInFlightRecordsFinish(t *testing.T) {
	cfg := defaultContentModerationConfig()
	cfg.Enabled = true
	cfg.Mode = ContentModerationModeObserve
	cfg.WorkerCount = 2
	raw, err := json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	settings := &contentModerationTestSettingRepo{values: map[string]string{
		SettingKeyRiskControlEnabled:      "true",
		SettingKeyContentModerationConfig: string(raw),
	}}
	repo := &multiBlockingContentModerationRepo{started: make(chan struct{}, 2), release: make(chan struct{})}
	service := NewContentModerationService(settings, repo, nil, nil, nil)
	t.Cleanup(service.Stop)
	for range 2 {
		service.enqueueRecord(ContentModerationCheckInput{}, cfg, &ContentModerationLog{Action: ContentModerationActionBlock}, "hash", false, false)
	}
	for range 2 {
		select {
		case <-repo.started:
		case <-time.After(time.Second):
			t.Fatal("accepted record did not start processing")
		}
	}

	cfg.WorkerCount = 1
	raw, err = json.Marshal(cfg)
	if err != nil {
		t.Fatal(err)
	}
	settings.values[SettingKeyContentModerationConfig] = string(raw)
	if _, err := service.refreshRuntimeSnapshot(context.Background()); err != nil {
		t.Fatal(err)
	}
	service.workerMu.Lock()
	handle := service.workerHandles[1]
	retiring := handle != nil && handle.retiring
	service.workerMu.Unlock()
	if !retiring {
		t.Fatal("second worker was not marked for retirement")
	}

	close(repo.release)
	deadline := time.Now().Add(time.Second)
	for len(repo.snapshotLogs()) != 2 && time.Now().Before(deadline) {
		time.Sleep(time.Millisecond)
	}
	if logs := repo.snapshotLogs(); len(logs) != 2 {
		t.Fatalf("worker shrink persisted %d of 2 in-flight records", len(logs))
	}
	deadline = time.Now().Add(time.Second)
	for service.runtimeWorkerCount() != 1 && time.Now().Before(deadline) {
		time.Sleep(time.Millisecond)
	}
	if workers := service.runtimeWorkerCount(); workers != 1 {
		t.Fatalf("expected one worker after shrink, got %d", workers)
	}
}

func TestContentModerationServicePrunesRemovedAPIKeyHealth(t *testing.T) {
	service := &ContentModerationService{keyHealth: make(map[string]*contentModerationKeyHealth)}
	service.beginModerationAPIKeyCall("keep")
	service.beginModerationAPIKeyCall("remove")
	service.pruneAPIKeyHealth([]string{"keep"})

	service.keyHealthMu.Lock()
	defer service.keyHealthMu.Unlock()
	if len(service.keyHealth) != 1 || service.keyHealth[moderationAPIKeyHash("keep")] == nil {
		t.Fatalf("unexpected retained key health: %#v", service.keyHealth)
	}
}
