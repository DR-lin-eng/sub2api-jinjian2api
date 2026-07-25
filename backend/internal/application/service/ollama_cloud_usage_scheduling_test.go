package service

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestOllamaCloudUsageIsAutoRefreshDue(t *testing.T) {
	debounce := time.Minute
	maxWait := time.Hour
	now := time.Date(2026, time.July, 25, 12, 0, 0, 0, time.UTC)
	fetched := now.Add(-30 * time.Minute)
	ptr := func(ts time.Time) *time.Time { return &ts }

	require.True(t, ollamaCloudUsageIsAutoRefreshDue(nil, nil, now, debounce, maxWait), "missing snapshot first due")
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(&OllamaCloudUsageSnapshot{Status: "bogus"}, nil, now, debounce, maxWait), "invalid status first due")

	okSnap := &OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusOK, FetchedAt: ptr(fetched),
		LastAttemptAt: fetched, NextRefreshAt: fetched.Add(maxWait),
	}
	require.False(t, ollamaCloudUsageIsAutoRefreshDue(okSnap, nil, now, debounce, maxWait), "no request after success")
	require.False(t, ollamaCloudUsageIsAutoRefreshDue(okSnap, ptr(fetched), now, debounce, maxWait), "request not after fetched_at")
	require.False(t, ollamaCloudUsageIsAutoRefreshDue(okSnap, ptr(now.Add(-30*time.Second)), now, debounce, maxWait), "debounce not elapsed")
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(okSnap, ptr(now.Add(-time.Minute)), now, debounce, maxWait), "single request quiet for debounce")

	// Continuous requests: last used is now, but max-wait from old fetch forces due.
	oldFetched := now.Add(-2 * time.Hour)
	oldSnap := &OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusOK, FetchedAt: ptr(oldFetched),
		LastAttemptAt: oldFetched, NextRefreshAt: oldFetched.Add(maxWait),
	}
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(oldSnap, ptr(now), now, debounce, maxWait), "max-wait forces due while requests continue")
	// First request after a very old snapshot is immediately due because fetched+maxWait is past.
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(oldSnap, ptr(now.Add(-time.Second)), now, debounce, maxWait), "stale snapshot first request immediate")

	failSnap := &OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusFailed, FetchedAt: ptr(fetched),
		LastAttemptAt: now.Add(-10 * time.Minute), NextRefreshAt: now.Add(20 * time.Minute),
	}
	require.False(t, ollamaCloudUsageIsAutoRefreshDue(failSnap, nil, now, debounce, maxWait), "failure without new request")
	require.False(t, ollamaCloudUsageIsAutoRefreshDue(failSnap, ptr(now.Add(-time.Minute)), now, debounce, maxWait), "failure blocked by backoff")
	failSnap.NextRefreshAt = now.Add(-time.Second)
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(failSnap, ptr(now.Add(-time.Minute)), now, debounce, maxWait), "failure after backoff with new request")

	require.True(t, ollamaCloudUsageIsAutoRefreshDue(&OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusOK, LastAttemptAt: now,
	}, nil, now, debounce, maxWait), "ok without fetched_at fails open")
}

// The success path stopped consulting next_refresh_at, which is where
// nextOllamaCloudUsageDelay used to apply the minimum interval. Activity may pull
// a refresh forward only as far as that floor, otherwise request traffic spaced
// just wider than the debounce drives the group's outbound rate far above the
// pre-existing minimum.
func TestOllamaCloudUsageAutoRefreshDueAtHonoursMinFetchInterval(t *testing.T) {
	debounce := time.Minute
	maxWait := time.Hour
	now := time.Date(2026, time.July, 25, 12, 0, 0, 0, time.UTC)
	ptr := func(ts time.Time) *time.Time { return &ts }

	// Debounce elapsed, but the last successful fetch is inside the floor.
	recent := now.Add(-5 * time.Minute)
	recentSnap := &OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusOK, FetchedAt: ptr(recent), LastAttemptAt: recent,
	}
	dueAt, ok := ollamaCloudUsageAutoRefreshDueAt(recentSnap, ptr(now.Add(-2*time.Minute)), debounce, maxWait)
	require.True(t, ok)
	require.Equal(t, recent.Add(OllamaCloudUsageMinFetchInterval), dueAt,
		"due time must be clamped to fetched_at + min fetch interval")
	require.False(t, ollamaCloudUsageIsAutoRefreshDue(recentSnap, ptr(now.Add(-2*time.Minute)), now, debounce, maxWait),
		"debounce alone must not refresh within the min fetch interval")

	// Once the floor has passed the debounce governs again.
	atFloor := now.Add(-OllamaCloudUsageMinFetchInterval)
	floorSnap := &OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusOK, FetchedAt: ptr(atFloor), LastAttemptAt: atFloor,
	}
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(floorSnap, ptr(now.Add(-2*time.Minute)), now, debounce, maxWait),
		"past the floor a quiet debounce window is due")

	// The floor never delays a refresh that max-wait has already forced.
	stale := now.Add(-2 * time.Hour)
	staleSnap := &OllamaCloudUsageSnapshot{
		Status: OllamaCloudUsageStatusOK, FetchedAt: ptr(stale), LastAttemptAt: stale,
	}
	require.True(t, ollamaCloudUsageIsAutoRefreshDue(staleSnap, ptr(now), now, debounce, maxWait),
		"max-wait still forces due on a stale snapshot")
}

func TestScheduleOllamaCloudUsageActivityOnlyForOllama(t *testing.T) {
	deferred := NewDeferredService(nil, nil, time.Second)
	ollama := ollamaUsageAccount(1)
	other := ollamaUsageAccount(2)
	other.Credentials["base_url"] = "https://api.openai.com"

	scheduleOllamaCloudUsageActivity(deferred, ollama)
	scheduleOllamaCloudUsageActivity(deferred, other)
	scheduleOllamaCloudUsageActivity(nil, ollama)

	_, ok := deferred.lastUsedUpdates.Load(int64(1))
	require.True(t, ok)
	_, ok = deferred.lastUsedUpdates.Load(int64(2))
	require.False(t, ok)
}
