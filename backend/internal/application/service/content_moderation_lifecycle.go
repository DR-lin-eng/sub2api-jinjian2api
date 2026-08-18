package service

import (
	"context"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/shared/servertiming"
)

func NewContentModerationService(
	settingRepo SettingRepository,
	repo ContentModerationRepository,
	hashCache ContentModerationHashCache,
	groupRepo GroupRepository,
	emailService *EmailService,
) *ContentModerationService {
	lifecycleCtx, lifecycleCancel := context.WithCancel(context.Background())
	svc := &ContentModerationService{
		settingRepo:     settingRepo,
		repo:            repo,
		hashCache:       hashCache,
		groupRepo:       groupRepo,
		emailService:    emailService,
		httpClient:      servertiming.InstrumentClient(nil),
		lifecycleCtx:    lifecycleCtx,
		lifecycleCancel: lifecycleCancel,
		workerHandles:   make(map[int]*contentModerationWorkerHandle),
		keyHealth:       make(map[string]*contentModerationKeyHealth),
	}
	if settingRepo != nil && repo != nil {
		loadCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		_, _ = svc.refreshRuntimeSnapshot(loadCtx)
		cancel()
		svc.workerWG.Add(1)
		go svc.cleanupWorker(lifecycleCtx)
	}
	return svc
}

func ProvideContentModerationService(
	settingRepo SettingRepository,
	repo ContentModerationRepository,
	hashCache ContentModerationHashCache,
	groupRepo GroupRepository,
	proxyRepo ProxyRepository,
	emailService *EmailService,
) *ContentModerationService {
	svc := NewContentModerationService(settingRepo, repo, hashCache, groupRepo, emailService)
	svc.proxyRepo = proxyRepo
	return svc
}

func (s *ContentModerationService) resizeWorkers(count int) {
	if s == nil || s.lifecycleCtx == nil || s.stopped.Load() {
		return
	}
	if count < 0 {
		count = 0
	}
	if count > maxContentModerationWorkerCount {
		count = maxContentModerationWorkerCount
	}
	if count > 0 {
		s.ensureAsyncQueue()
	}

	s.workerMu.Lock()
	defer s.workerMu.Unlock()
	if s.stopped.Load() {
		return
	}
	for id, handle := range s.workerHandles {
		if id >= count && !handle.retiring {
			handle.retiring = true
			handle.retire()
		}
	}
	for id := 0; id < count; id++ {
		if s.lifecycleCtx.Err() != nil {
			return
		}
		if _, exists := s.workerHandles[id]; exists {
			continue
		}
		workerCtx, cancel := context.WithCancel(s.lifecycleCtx)
		handle := &contentModerationWorkerHandle{retire: cancel}
		s.workerHandles[id] = handle
		s.workerWG.Add(1)
		go s.worker(workerCtx, id, handle)
	}
}

// Stop releases all moderation workers and the periodic cleanup loop.
func (s *ContentModerationService) Stop() {
	if s == nil {
		return
	}
	s.stopOnce.Do(func() {
		s.stopped.Store(true)
		if s.lifecycleCancel != nil {
			s.lifecycleCancel()
		}
		s.workerMu.Lock()
		for _, handle := range s.workerHandles {
			handle.retire()
		}
		s.workerMu.Unlock()
		s.workerWG.Wait()
		queue := s.asyncTaskQueue()
		if queue == nil {
			return
		}
		for {
			select {
			case <-queue:
			default:
				return
			}
		}
	})
}

func (s *ContentModerationService) workerExited(id int, handle *contentModerationWorkerHandle) {
	s.workerMu.Lock()
	if s.workerHandles[id] == handle {
		delete(s.workerHandles, id)
	}
	stopped := s.stopped.Load()
	s.workerMu.Unlock()
	if !stopped {
		s.reconcileWorkers(s.runtimeSnapshot.Load())
	}
}

func (s *ContentModerationService) ensureAsyncQueue() chan *contentModerationTask {
	if s == nil || s.lifecycleCtx == nil || s.stopped.Load() || s.lifecycleCtx.Err() != nil {
		return nil
	}
	if queue := s.asyncQueue.Load(); queue != nil {
		return queue.tasks
	}
	queue := &contentModerationQueue{tasks: make(chan *contentModerationTask, maxContentModerationQueueSize)}
	if s.asyncQueue.CompareAndSwap(nil, queue) {
		return queue.tasks
	}
	return s.asyncQueue.Load().tasks
}

func (s *ContentModerationService) asyncTaskQueue() chan *contentModerationTask {
	if s == nil {
		return nil
	}
	queue := s.asyncQueue.Load()
	if queue == nil {
		return nil
	}
	return queue.tasks
}

func (s *ContentModerationService) runtimeWorkerCount() int {
	if s == nil {
		return 0
	}
	s.workerMu.Lock()
	defer s.workerMu.Unlock()
	return len(s.workerHandles)
}
