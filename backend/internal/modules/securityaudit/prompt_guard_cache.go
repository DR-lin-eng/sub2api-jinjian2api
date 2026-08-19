package securityaudit

import (
	"context"
	"crypto/sha256"
	"encoding/binary"
	"hash"
	"maps"
	"slices"
	"sync"
	"time"
)

const (
	guardResultCacheTTL        = 5 * time.Minute
	guardResultCacheMaxEntries = 8192
	guardResultCacheShardCount = 64
)

type guardScanCacheKey [sha256.Size]byte

type guardResultCacheEntry struct {
	result    *NormalizedResult
	expiresAt time.Time
}

type guardResultCacheShard struct {
	mu      sync.RWMutex
	entries map[guardScanCacheKey]guardResultCacheEntry
}

// guardResultCache stores only policy-scoped digests and normalized scanner
// output. Prompt text never becomes a cache key or value.
type guardResultCache struct {
	shards          [guardResultCacheShardCount]guardResultCacheShard
	ttl             time.Duration
	entriesPerShard int
}

type guardResultFlightCall struct {
	done   chan struct{}
	result *NormalizedResult
	err    error
}

// guardResultFlight keeps the first caller synchronous so cancellation cannot
// leave its Guard request running after Evaluate returns. Followers may cancel
// independently without interrupting the shared leader.
type guardResultFlight struct {
	mu    sync.Mutex
	calls map[guardScanCacheKey]*guardResultFlightCall
}

func (f *guardResultFlight) Do(
	ctx context.Context,
	key guardScanCacheKey,
	fn func() (*NormalizedResult, error),
) (*NormalizedResult, error, bool) {
	f.mu.Lock()
	if f.calls == nil {
		f.calls = make(map[guardScanCacheKey]*guardResultFlightCall)
	}
	if call := f.calls[key]; call != nil {
		f.mu.Unlock()
		select {
		case <-ctx.Done():
			return nil, guardContextError(ctx), true
		case <-call.done:
			return cloneNormalizedResult(call.result), call.err, true
		}
	}
	call := &guardResultFlightCall{done: make(chan struct{})}
	f.calls[key] = call
	f.mu.Unlock()

	result, err := callGuardResultFlight(fn)
	sharedResult := cloneNormalizedResult(result)
	f.mu.Lock()
	call.result, call.err = sharedResult, err
	delete(f.calls, key)
	close(call.done)
	f.mu.Unlock()
	return result, err, false
}

func callGuardResultFlight(fn func() (*NormalizedResult, error)) (result *NormalizedResult, err error) {
	defer func() {
		if recover() != nil {
			result = nil
			err = &GuardError{Code: ErrorCodeUnavailable}
		}
	}()
	return fn()
}

func newGuardResultCache(maxEntries int, ttl time.Duration) *guardResultCache {
	if maxEntries < guardResultCacheShardCount {
		maxEntries = guardResultCacheShardCount
	}
	if ttl <= 0 {
		ttl = guardResultCacheTTL
	}
	return &guardResultCache{
		ttl:             ttl,
		entriesPerShard: (maxEntries + guardResultCacheShardCount - 1) / guardResultCacheShardCount,
	}
}

func (c *guardResultCache) Get(key guardScanCacheKey, now time.Time) (*NormalizedResult, bool) {
	if c == nil {
		return nil, false
	}
	shard := &c.shards[int(key[0])%len(c.shards)]
	shard.mu.RLock()
	entry, ok := shard.entries[key]
	if ok && now.Before(entry.expiresAt) {
		result := cloneNormalizedResult(entry.result)
		shard.mu.RUnlock()
		return result, result != nil
	}
	shard.mu.RUnlock()
	if ok {
		shard.mu.Lock()
		if current, exists := shard.entries[key]; exists && !now.Before(current.expiresAt) {
			delete(shard.entries, key)
		}
		shard.mu.Unlock()
	}
	return nil, false
}

func (c *guardResultCache) Set(key guardScanCacheKey, result *NormalizedResult, now time.Time) {
	if c == nil || !cacheableGuardResult(result) {
		return
	}
	shard := &c.shards[int(key[0])%len(c.shards)]
	shard.mu.Lock()
	if shard.entries == nil {
		shard.entries = make(map[guardScanCacheKey]guardResultCacheEntry, c.entriesPerShard)
	}
	if _, exists := shard.entries[key]; !exists && len(shard.entries) >= c.entriesPerShard {
		var victim guardScanCacheKey
		var victimExpiry time.Time
		hasVictim := false
		for candidate, entry := range shard.entries {
			if !now.Before(entry.expiresAt) {
				delete(shard.entries, candidate)
				continue
			}
			if !hasVictim || entry.expiresAt.Before(victimExpiry) {
				victim, victimExpiry, hasVictim = candidate, entry.expiresAt, true
			}
		}
		if len(shard.entries) >= c.entriesPerShard && hasVictim {
			delete(shard.entries, victim)
		}
	}
	shard.entries[key] = guardResultCacheEntry{
		result:    cloneNormalizedResult(result),
		expiresAt: now.Add(c.ttl),
	}
	shard.mu.Unlock()
}

func (c *guardResultCache) Len() int {
	if c == nil {
		return 0
	}
	total := 0
	for index := range c.shards {
		shard := &c.shards[index]
		shard.mu.RLock()
		total += len(shard.entries)
		shard.mu.RUnlock()
	}
	return total
}

func guardPolicyFingerprint(cfg ActiveConfig, endpoints []ActiveEndpoint) [sha256.Size]byte {
	digest := sha256.New()
	writeGuardFingerprintInt64(digest, cfg.ConfigVersion)
	writeGuardFingerprintInt64(digest, int64(len(cfg.Scanners)))
	for _, scanner := range cfg.Scanners {
		writeGuardFingerprintString(digest, scanner)
	}
	writeGuardFingerprintInt64(digest, int64(len(endpoints)))
	for _, endpoint := range endpoints {
		writeGuardFingerprintString(digest, endpoint.ID)
		writeGuardFingerprintString(digest, endpoint.Protocol)
		writeGuardFingerprintString(digest, endpoint.BaseURL)
		writeGuardFingerprintString(digest, endpoint.Model)
		writeGuardFingerprintString(digest, endpoint.Token)
		writeGuardFingerprintInt64(digest, int64(endpoint.TimeoutMS))
		writeGuardFingerprintInt64(digest, int64(endpoint.InputLimit))
	}
	var fingerprint [sha256.Size]byte
	copy(fingerprint[:], digest.Sum(nil))
	return fingerprint
}

func guardResultKey(policy [sha256.Size]byte, chunk string) guardScanCacheKey {
	digest := sha256.New()
	_, _ = digest.Write(policy[:])
	writeGuardFingerprintString(digest, chunk)
	var key guardScanCacheKey
	copy(key[:], digest.Sum(nil))
	return key
}

func writeGuardFingerprintInt64(digest hash.Hash, value int64) {
	var encoded [8]byte
	binary.LittleEndian.PutUint64(encoded[:], uint64(value))
	_, _ = digest.Write(encoded[:])
}

func writeGuardFingerprintString(digest hash.Hash, value string) {
	writeGuardFingerprintInt64(digest, int64(len(value)))
	_, _ = digest.Write([]byte(value))
}

func cacheableGuardResult(result *NormalizedResult) bool {
	if result == nil {
		return false
	}
	switch result.Action {
	case ActionAllow:
		return result.Decision == EventPass
	case ActionWarn:
		return result.Decision == EventFlag
	case ActionBlock:
		return result.Decision == EventCritical
	default:
		return false
	}
}

func cloneNormalizedResult(result *NormalizedResult) *NormalizedResult {
	if result == nil {
		return nil
	}
	cloned := *result
	cloned.Categories = slices.Clone(result.Categories)
	cloned.MatchedScanners = slices.Clone(result.MatchedScanners)
	cloned.ScannerScores = maps.Clone(result.ScannerScores)
	cloned.ScannerEvidence = maps.Clone(result.ScannerEvidence)
	cloned.UnknownCategories = slices.Clone(result.UnknownCategories)
	return &cloned
}
