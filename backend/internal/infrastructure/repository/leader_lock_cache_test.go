package repository

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestLeaderLockCacheAcquireContendedAndRelease(t *testing.T) {
	cache := &leaderLockCache{locks: make(map[string]localLeaderLock)}
	ctx := context.Background()
	got, err := cache.TryAcquireLeaderLock(ctx, "job", "A", time.Minute)
	require.NoError(t, err)
	require.True(t, got)
	got, err = cache.TryAcquireLeaderLock(ctx, "job", "B", time.Minute)
	require.NoError(t, err)
	require.False(t, got)
	require.NoError(t, cache.ReleaseLeaderLock(ctx, "job", "A"))
	got, err = cache.TryAcquireLeaderLock(ctx, "job", "B", time.Minute)
	require.NoError(t, err)
	require.True(t, got)
}

func TestLeaderLockCacheExpiredEntryCanBeReclaimed(t *testing.T) {
	cache := &leaderLockCache{locks: make(map[string]localLeaderLock)}
	ctx := context.Background()
	got, err := cache.TryAcquireLeaderLock(ctx, "job", "A", time.Millisecond)
	require.NoError(t, err)
	require.True(t, got)
	time.Sleep(5 * time.Millisecond)
	got, err = cache.TryAcquireLeaderLock(ctx, "job", "B", time.Minute)
	require.NoError(t, err)
	require.True(t, got)
}
