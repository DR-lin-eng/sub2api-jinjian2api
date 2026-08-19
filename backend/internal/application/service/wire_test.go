package service

import (
	"context"
	"errors"
	"sync/atomic"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/dgraph-io/ristretto"
	"github.com/zeromicro/go-zero/core/collection"
)

type wireAuthCacheStub struct {
	subscribeCalls atomic.Int64
}

func (*wireAuthCacheStub) GetCreateAttemptCount(context.Context, int64) (int, error) { return 0, nil }
func (*wireAuthCacheStub) IncrementCreateAttemptCount(context.Context, int64) error  { return nil }
func (*wireAuthCacheStub) DeleteCreateAttemptCount(context.Context, int64) error     { return nil }
func (*wireAuthCacheStub) IncrementDailyUsage(context.Context, string) error         { return nil }
func (*wireAuthCacheStub) SetDailyUsageExpiry(context.Context, string, time.Duration) error {
	return nil
}
func (*wireAuthCacheStub) GetAuthCache(context.Context, string) (*APIKeyAuthCacheEntry, error) {
	return nil, errors.New("cache miss")
}
func (*wireAuthCacheStub) SetAuthCache(context.Context, string, *APIKeyAuthCacheEntry, time.Duration) error {
	return nil
}
func (*wireAuthCacheStub) DeleteAuthCache(context.Context, string) error              { return nil }
func (*wireAuthCacheStub) PublishAuthCacheInvalidation(context.Context, string) error { return nil }
func (s *wireAuthCacheStub) SubscribeAuthCacheInvalidation(ctx context.Context, _ func(string)) error {
	s.subscribeCalls.Add(1)
	NotifyAuthCacheSubscriptionReady(ctx)
	<-ctx.Done()
	return ctx.Err()
}

func TestProvideTimingWheelService_ReturnsError(t *testing.T) {
	original := newTimingWheel
	t.Cleanup(func() { newTimingWheel = original })

	newTimingWheel = func(_ time.Duration, _ int, _ collection.Execute) (*collection.TimingWheel, error) {
		return nil, errors.New("boom")
	}

	svc, err := ProvideTimingWheelService()
	if err == nil {
		t.Fatalf("期望返回 error，但得到 nil")
	}
	if svc != nil {
		t.Fatalf("期望返回 nil svc，但得到非空")
	}
}

func TestProvideTimingWheelService_Success(t *testing.T) {
	svc, err := ProvideTimingWheelService()
	if err != nil {
		t.Fatalf("期望 err 为 nil，但得到: %v", err)
	}
	if svc == nil {
		t.Fatalf("期望 svc 非空，但得到 nil")
	}
	svc.Stop()
}

func TestOpsProvidersStayUnconstructedWhenHardDisabled(t *testing.T) {
	cfg := &config.Config{Ops: config.OpsConfig{Enabled: false}}

	if got := ProvideOpsMetricsCollector(nil, nil, nil, nil, nil, nil, cfg); got != nil {
		t.Fatal("disabled ops metrics collector must not be constructed")
	}
	if got := ProvideOpsAggregationService(nil, nil, nil, nil, cfg); got != nil {
		t.Fatal("disabled ops aggregation service must not be constructed")
	}
	if got := ProvideOpsAlertEvaluatorService(nil, nil, nil, cfg, nil); got != nil {
		t.Fatal("disabled ops alert evaluator must not be constructed")
	}
	if got := ProvideOpsCleanupService(nil, nil, nil, cfg, nil, nil, nil); got != nil {
		t.Fatal("disabled ops cleanup service must not be constructed")
	}
	if got := ProvideOpsScheduledReportService(nil, nil, nil, nil, cfg); got != nil {
		t.Fatal("disabled ops scheduled report service must not be constructed")
	}
	if got := ProvideOpsSystemLogSink(nil, nil, nil, cfg); got != nil {
		t.Fatal("disabled ops system log sink must not be constructed")
	}
}

func TestProvideOpsServiceSkipsRuntimeSettingsIOWhenHardDisabled(t *testing.T) {
	cfg := &config.Config{Ops: config.OpsConfig{Enabled: false}}
	repo := newRuntimeSettingRepoStub()

	svc := ProvideOpsService(
		nil,
		repo,
		cfg,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
	)

	if repo.getValueCalls != 0 || repo.getMultipleCalls != 0 {
		t.Fatalf("disabled ops performed settings reads: value=%d multiple=%d", repo.getValueCalls, repo.getMultipleCalls)
	}
	if svc.RuntimeSettingsRefreshHealth().Running {
		t.Fatal("disabled ops started the runtime settings refresh loop")
	}
}

func TestLightweightProvidersSkipDisabledAndStandaloneRuntimes(t *testing.T) {
	t.Run("dashboard aggregation", func(t *testing.T) {
		cfg := &config.Config{}
		if got := ProvideDashboardAggregationService(nil, nil, nil, nil, cfg, nil); got != nil {
			t.Fatal("disabled dashboard aggregation must not be constructed")
		}
	})

	t.Run("api key invalidation subscriber stays disabled", func(t *testing.T) {
		cache := &wireAuthCacheStub{}
		svc := NewAPIKeyService(nil, nil, nil, cache, &config.Config{})
		localCache, err := ristretto.NewCache(&ristretto.Config{NumCounters: 10, MaxCost: 1, BufferItems: 64})
		if err != nil {
			t.Fatal(err)
		}
		defer localCache.Close()
		svc.authNegativeCacheL1 = localCache

		ProvideAPIKeyAuthCacheInvalidator(svc)
		t.Cleanup(svc.StopAuthCacheInvalidationSubscriber)
		time.Sleep(10 * time.Millisecond)
		if calls := cache.subscribeCalls.Load(); calls != 0 {
			t.Fatalf("standalone mode started %d cache invalidation subscriptions", calls)
		}
	})

	t.Run("request priority sync", func(t *testing.T) {
		repo := newRuntimeSettingRepoStub()
		notifier := newRequestPrioritySettingsNotifier()
		svc := ProvideSettingService(repo, nil, nil, notifier, &config.Config{})
		t.Cleanup(svc.StopRequestPriorityAdmissionSettingsSync)
		time.Sleep(10 * time.Millisecond)
		if subscribers := notifier.subscriberCount(); subscribers != 0 {
			t.Fatalf("standalone mode started %d request-priority subscriptions", subscribers)
		}
	})
}
