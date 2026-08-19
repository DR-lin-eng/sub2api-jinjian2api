package securityaudit

import (
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestAtomicMetricsExposeCountsLatencyDistributionAndAsyncDelivery(t *testing.T) {
	metrics := NewAtomicMetrics()
	latencies := []time.Duration{10, 20, 30, 40, 100}
	kinds := []DecisionKind{DecisionAllow, DecisionFlag, DecisionBlock, DecisionUnavailable, DecisionInvalid}
	for index := range latencies {
		metrics.Observe(kinds[index], latencies[index]*time.Millisecond)
	}
	metrics.IncTimeout()
	metrics.IncFailover()
	metrics.IncBulkheadFull()
	metrics.IncCacheHit()
	metrics.IncCoalesced()
	metrics.IncRecordFailed()
	metrics.IncEnqueued()
	metrics.IncDropped()

	snapshot := metrics.Snapshot()
	require.Equal(t, int64(5), snapshot.Total)
	require.Equal(t, int64(5), snapshot.LatencyCount)
	require.Equal(t, int64(40), snapshot.LatencyAvgMS)
	require.Equal(t, int64(30), snapshot.LatencyP50MS)
	require.Equal(t, int64(40), snapshot.LatencyP95MS)
	require.Equal(t, int64(40), snapshot.LatencyP99MS)
	require.Equal(t, int64(100), snapshot.LatencyMaxMS)
	require.Equal(t, int64(1), snapshot.CacheHits)
	require.Equal(t, int64(1), snapshot.Coalesced)
	require.Equal(t, AuditMetricsSnapshot{Enqueued: 1, Dropped: 1}, metrics.AuditSnapshot())
}

func TestAtomicMetricsConcurrentObservationIsBoundedAndRaceSafe(t *testing.T) {
	metrics := NewAtomicMetrics()
	const observations = 4096
	var wg sync.WaitGroup
	for index := 0; index < observations; index++ {
		wg.Add(1)
		go func(value int) {
			defer wg.Done()
			metrics.Observe(DecisionAllow, time.Duration(value%250)*time.Millisecond)
		}(index)
	}
	wg.Wait()
	require.Equal(t, int64(observations), metrics.Snapshot().Total)
	require.Equal(t, uint64(observations), metrics.latencyNext.Load())
	stored := 0
	for index := range metrics.latencies {
		if metrics.latencies[index].Load() > 0 {
			stored++
		}
	}
	require.Equal(t, latencySampleCapacity, stored)
}

func BenchmarkAtomicMetricsObserveParallel(b *testing.B) {
	metrics := NewAtomicMetrics()
	b.ReportAllocs()
	b.RunParallel(func(parallel *testing.PB) {
		for parallel.Next() {
			metrics.Observe(DecisionAllow, 10*time.Millisecond)
		}
	})
}
