package service

import (
	"errors"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/zeromicro/go-zero/core/collection"
)

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
	if got := ProvideOpsAlertEvaluatorService(nil, nil, nil, nil, cfg, nil); got != nil {
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
	if got := ProvideOpsIngressRejectAggregator(nil, nil, cfg); got != nil {
		t.Fatal("disabled ingress reject aggregator must not be constructed")
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
