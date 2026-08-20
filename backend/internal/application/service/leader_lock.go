package service

import (
	"context"
	"database/sql"
	"time"
)

// LeaderLockCache provides process-local mutual exclusion for optional scheduled
// jobs. The standalone branch deliberately does not coordinate replicas.
type LeaderLockCache interface {
	// TryAcquireLeaderLock sets key=owner with the given TTL iff key is absent.
	// It returns true when the caller becomes the owner.
	TryAcquireLeaderLock(ctx context.Context, key, owner string, ttl time.Duration) (bool, error)
	// ReleaseLeaderLock deletes key iff it is still owned by owner.
	ReleaseLeaderLock(ctx context.Context, key, owner string) error
}

// tryAcquireSingletonLeaderLock provides best-effort single-flight execution of
// a periodic background job inside this process.
//
// Semantics:
//   - acquired      -> returns a non-nil release func and true; callers should
//     defer the release once the job finishes.
//   - held by another local task -> returns (nil, false); callers skip this cycle.
//   - no cache -> runs without gating, so a standalone deployment never starves.
//
// The TTL is purely a crash-safety bound: callers release the lock as soon as the
// job completes, so leadership is re-contested every cycle rather than pinned to
// one process. The TTL must therefore be larger than the job's worst-case
// runtime so the lock does not expire mid-run.
func tryAcquireSingletonLeaderLock(ctx context.Context, cache LeaderLockCache, _ *sql.DB, key, owner string, ttl time.Duration) (func(), bool) {
	if ctx == nil {
		ctx = context.Background()
	}

	if cache != nil {
		ok, err := cache.TryAcquireLeaderLock(ctx, key, owner, ttl)
		if err == nil {
			if !ok {
				return nil, false
			}
			release := func() {
				ctx2, cancel := context.WithTimeout(context.Background(), 2*time.Second)
				defer cancel()
				_ = cache.ReleaseLeaderLock(ctx2, key, owner)
			}
			return release, true
		}
		// A local cache error should not prevent the optional task from running.
	}

	// No coordination backend available: run without gating.
	return func() {}, true
}
