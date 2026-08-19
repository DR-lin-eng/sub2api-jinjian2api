package repository

import (
	"context"
	"sync"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/redis/go-redis/v9"
)

// leaderLockCache is intentionally process-local. The standalone branch does
// not elect a leader across replicas; the Redis argument remains in the
// constructor only so older Wire graphs and tests can roll forward smoothly.
type leaderLockCache struct {
	mu    sync.Mutex
	locks map[string]localLeaderLock
}

type localLeaderLock struct {
	owner     string
	expiresAt time.Time
}

func NewLeaderLockCache(_ *redis.Client) service.LeaderLockCache {
	return &leaderLockCache{locks: make(map[string]localLeaderLock)}
}

func (c *leaderLockCache) TryAcquireLeaderLock(_ context.Context, key, owner string, ttl time.Duration) (bool, error) {
	if c == nil || key == "" || owner == "" {
		return false, nil
	}
	now := time.Now()
	c.mu.Lock()
	defer c.mu.Unlock()
	if current, ok := c.locks[key]; ok && current.expiresAt.After(now) && current.owner != owner {
		return false, nil
	}
	c.locks[key] = localLeaderLock{owner: owner, expiresAt: now.Add(ttl)}
	return true, nil
}

func (c *leaderLockCache) ReleaseLeaderLock(_ context.Context, key, owner string) error {
	if c == nil {
		return nil
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if current, ok := c.locks[key]; ok && current.owner == owner {
		delete(c.locks, key)
	}
	return nil
}
