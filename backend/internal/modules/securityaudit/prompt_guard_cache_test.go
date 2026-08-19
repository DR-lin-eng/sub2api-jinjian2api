package securityaudit

import (
	"context"
	"fmt"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestGuardResultCacheIsBoundedExpiresAndOwnsResults(t *testing.T) {
	const maxEntries = guardResultCacheShardCount
	cache := newGuardResultCache(maxEntries, time.Minute)
	now := time.Date(2026, 8, 19, 0, 0, 0, 0, time.UTC)
	policy := guardPolicyFingerprint(guardConfig(
		ActiveEndpoint{ID: "one", Model: "guard-v1", Enabled: true},
	), []ActiveEndpoint{{ID: "one", Model: "guard-v1", Enabled: true}})
	result := &NormalizedResult{
		Decision: EventPass, RiskLevel: RiskLow, Action: ActionAllow,
		Categories: []string{"pii"}, ScannerScores: map[string]float64{"pii": 0.1},
	}

	firstKey := guardResultKey(policy, "prompt-0")
	cache.Set(firstKey, result, now)
	first, ok := cache.Get(firstKey, now)
	require.True(t, ok)
	first.Categories[0] = "mutated"
	first.ScannerScores["pii"] = 1
	again, ok := cache.Get(firstKey, now)
	require.True(t, ok)
	require.Equal(t, []string{"pii"}, again.Categories)
	require.Equal(t, 0.1, again.ScannerScores["pii"])

	for index := 1; index < maxEntries*20; index++ {
		cache.Set(guardResultKey(policy, fmt.Sprintf("prompt-%d", index)), result, now)
	}
	require.LessOrEqual(t, cache.Len(), maxEntries)

	expiringKey := guardResultKey(policy, "expires")
	cache.Set(expiringKey, result, now)
	_, ok = cache.Get(expiringKey, now.Add(time.Minute))
	require.False(t, ok)

	inconsistentKey := guardResultKey(policy, "inconsistent")
	cache.Set(inconsistentKey, &NormalizedResult{Decision: EventCritical, Action: ActionAllow}, now)
	_, ok = cache.Get(inconsistentKey, now)
	require.False(t, ok, "inconsistent scanner decisions must never enter the cache")
}

func BenchmarkGuardEvaluatorCachedSingleChunk(b *testing.B) {
	var scannerCalls atomic.Int64
	evaluator := newGuardEvaluator(PromptScannerFunc(func(context.Context, ActiveEndpoint, string, []string) (*NormalizedResult, error) {
		scannerCalls.Add(1)
		return &NormalizedResult{
			Decision: EventPass, RiskLevel: RiskLow, Action: ActionAllow, Safety: "Safe",
			ScannerScores: map[string]float64{}, ScannerEvidence: map[string]string{},
		}, nil
	}), nil, nil, 64, 16)
	cfg := guardConfig(ActiveEndpoint{ID: "one", Model: "guard-v1", Enabled: true, TimeoutMS: 1000, InputLimit: 4000})
	snapshot := PromptSnapshot{ScanText: "repeated benchmark prompt", PromptLength: 25}
	if _, err := evaluator.Evaluate(context.Background(), cfg, snapshot); err != nil {
		b.Fatal(err)
	}

	b.ReportAllocs()
	b.ResetTimer()
	var failures atomic.Int64
	b.RunParallel(func(parallel *testing.PB) {
		for parallel.Next() {
			decision, err := evaluator.Evaluate(context.Background(), cfg, snapshot)
			if err != nil || decision == nil || decision.Kind != DecisionAllow {
				failures.Add(1)
			}
		}
	})
	b.StopTimer()
	if failures.Load() != 0 {
		b.Fatalf("cached evaluation failures: %d", failures.Load())
	}
	if calls := scannerCalls.Load(); calls != 1 {
		b.Fatalf("scanner called %d times, want 1", calls)
	}
}
