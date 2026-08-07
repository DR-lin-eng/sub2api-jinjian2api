package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"math/rand/v2"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/dgraph-io/ristretto"
)

const apiKeyAuthSnapshotVersion = 22 // v22: remove downstream billing and per-user quota fields

type apiKeyAuthCacheConfig struct {
	l1Size        int
	l1TTL         time.Duration
	l2TTL         time.Duration
	negativeTTL   time.Duration
	jitterPercent int
	singleflight  bool
}

type apiKeyAuthHotCacheEntry struct {
	digest    [sha256.Size]byte
	entry     *APIKeyAuthCacheEntry
	apiKey    *APIKey
	expiresAt int64
}

func newAPIKeyAuthCacheConfig(cfg *config.Config) apiKeyAuthCacheConfig {
	if cfg == nil {
		return apiKeyAuthCacheConfig{}
	}
	auth := cfg.APIKeyAuth
	return apiKeyAuthCacheConfig{
		l1Size:        auth.L1Size,
		l1TTL:         time.Duration(auth.L1TTLSeconds) * time.Second,
		l2TTL:         time.Duration(auth.L2TTLSeconds) * time.Second,
		negativeTTL:   time.Duration(auth.NegativeTTLSeconds) * time.Second,
		jitterPercent: auth.JitterPercent,
		singleflight:  auth.Singleflight,
	}
}

func (c apiKeyAuthCacheConfig) l1Enabled() bool {
	return c.l1Size > 0 && c.l1TTL > 0
}

func (c apiKeyAuthCacheConfig) l2Enabled() bool {
	return c.l2TTL > 0
}

func (c apiKeyAuthCacheConfig) negativeEnabled() bool {
	return c.negativeTTL > 0
}

// jitterTTL 为缓存 TTL 添加抖动，避免多个请求在同一时刻同时过期触发集中回源。
// 这里直接使用 rand/v2 的顶层函数：并发安全，无需全局互斥锁。
func (c apiKeyAuthCacheConfig) jitterTTL(ttl time.Duration) time.Duration {
	if ttl <= 0 {
		return ttl
	}
	if c.jitterPercent <= 0 {
		return ttl
	}
	percent := c.jitterPercent
	if percent > 100 {
		percent = 100
	}
	delta := float64(percent) / 100
	randVal := rand.Float64()
	factor := 1 - delta + randVal*(2*delta)
	if factor <= 0 {
		return ttl
	}
	return time.Duration(float64(ttl) * factor)
}

func (s *APIKeyService) initAuthCache(cfg *config.Config) {
	s.authCfg = newAPIKeyAuthCacheConfig(cfg)
	if s.authCfg.negativeEnabled() {
		negativeSize := defaultNegativeAuthCacheSize
		if s.authCfg.l1Size > 0 && s.authCfg.l1Size < negativeSize {
			negativeSize = s.authCfg.l1Size
		}
		cache, err := ristretto.NewCache(&ristretto.Config{
			NumCounters: int64(negativeSize) * 10,
			MaxCost:     int64(negativeSize),
			BufferItems: 64,
		})
		if err == nil {
			s.authNegativeCacheL1 = cache
		}
	}
	if s.authCfg.l1Enabled() {
		cache, err := ristretto.NewCache(&ristretto.Config{
			NumCounters: int64(s.authCfg.l1Size) * 10,
			MaxCost:     int64(s.authCfg.l1Size),
			BufferItems: 64,
		})
		if err == nil {
			s.authCacheL1 = cache
		}
	}
}

// StartAuthCacheInvalidationSubscriber starts the Pub/Sub subscriber for L1 cache invalidation.
// This should be called after the service is fully initialized.
func (s *APIKeyService) StartAuthCacheInvalidationSubscriber(ctx context.Context) {
	if s.cache == nil || (s.authCacheL1 == nil && s.authNegativeCacheL1 == nil) {
		return
	}
	s.authInvalidationStart.Do(func() {
		subscriberCtx, cancel := context.WithCancel(ctx)
		subscriberCtx = withAuthCacheSubscriptionReady(subscriberCtx, func() {
			s.authInvalidationConnected.Store(true)
		})
		s.authInvalidationCancel = cancel
		s.authInvalidationWG.Add(1)
		go func() {
			defer s.authInvalidationWG.Done()
			backoff := time.Second
			for {
				err := s.cache.SubscribeAuthCacheInvalidation(subscriberCtx, func(cacheKey string) {
					s.invalidateLocalAuthCache(cacheKey)
				})
				wasConnected := s.authInvalidationConnected.Swap(false)
				if subscriberCtx.Err() != nil {
					return
				}
				if wasConnected {
					backoff = time.Second
				}
				s.authInvalidationFailures.Add(1)
				if err == nil {
					err = errors.New("auth cache invalidation subscription closed")
				}
				slog.Warn("failed to start auth cache invalidation subscriber; retrying", "error", err, "retry_in", backoff)
				timer := time.NewTimer(backoff)
				select {
				case <-subscriberCtx.Done():
					timer.Stop()
					return
				case <-timer.C:
				}
				if backoff < 30*time.Second {
					backoff *= 2
					if backoff > 30*time.Second {
						backoff = 30 * time.Second
					}
				}
			}
		}()
	})
}

func (s *APIKeyService) invalidateLocalAuthCache(cacheKey string) {
	if s == nil {
		return
	}
	if s.authCacheL1 != nil {
		s.authCacheL1.Del(cacheKey)
	}
	if s.authNegativeCacheL1 != nil {
		s.authNegativeCacheL1.Del(cacheKey)
	}
	s.clearAuthHotCacheEntry(cacheKey)
}

type AuthCacheInvalidationSubscriberHealth struct {
	Connected bool   `json:"connected"`
	Failures  uint64 `json:"failures"`
}

func (s *APIKeyService) AuthCacheInvalidationSubscriberHealth() AuthCacheInvalidationSubscriberHealth {
	if s == nil {
		return AuthCacheInvalidationSubscriberHealth{}
	}
	return AuthCacheInvalidationSubscriberHealth{
		Connected: s.authInvalidationConnected.Load(),
		Failures:  s.authInvalidationFailures.Load(),
	}
}

func (s *APIKeyService) StopAuthCacheInvalidationSubscriber() {
	if s == nil {
		return
	}
	s.authInvalidationStop.Do(func() {
		if s.authInvalidationCancel != nil {
			s.authInvalidationCancel()
		}
		s.authInvalidationWG.Wait()
	})
}

func (s *APIKeyService) authCacheKey(key string) string {
	return authCacheKeyFromDigest(authCacheDigest(key))
}

func authCacheDigest(key string) [sha256.Size]byte {
	return sha256.Sum256([]byte(key))
}

func authCacheKeyFromDigest(digest [sha256.Size]byte) string {
	return hex.EncodeToString(digest[:])
}

func (s *APIKeyService) getAuthHotCacheEntry(digest [sha256.Size]byte, now time.Time) (*apiKeyAuthHotCacheEntry, bool) {
	if s == nil {
		return nil, false
	}
	hot := s.authHotCache.Load()
	if hot == nil || hot.digest != digest || hot.entry == nil {
		return nil, false
	}
	if hot.expiresAt <= now.UnixNano() {
		s.authHotCache.CompareAndSwap(hot, nil)
		return nil, false
	}
	return hot, true
}

func (s *APIKeyService) setAuthHotCacheEntry(digest [sha256.Size]byte, key string, entry *APIKeyAuthCacheEntry) {
	if s == nil || entry == nil || entry.NotFound || entry.Snapshot == nil || entry.Snapshot.Version != apiKeyAuthSnapshotVersion {
		return
	}
	now := time.Now()
	current := s.authHotCache.Load()
	if current != nil && current.expiresAt > now.UnixNano() {
		// Keep the current hot key stable. Replacing it on every ordinary L1 hit
		// would turn mixed-key traffic into allocation and cache-line churn.
		return
	}
	ttl := s.authCfg.l1TTL
	if !s.authCfg.l1Enabled() {
		return
	}
	if ttl <= 0 {
		return
	}
	prototype := s.authCacheRuntimeAPIKey(entry)
	if prototype == nil {
		return
	}
	clone := *prototype
	clone.Key = key
	ttl = s.authCfg.jitterTTL(ttl)
	hot := &apiKeyAuthHotCacheEntry{
		digest:    digest,
		entry:     entry,
		apiKey:    &clone,
		expiresAt: now.Add(ttl).UnixNano(),
	}
	if current == nil {
		s.authHotCache.CompareAndSwap(nil, hot)
		return
	}
	s.authHotCache.CompareAndSwap(current, hot)
}

func (s *APIKeyService) applyAuthHotCacheEntry(key string, hot *apiKeyAuthHotCacheEntry) (*APIKey, bool, error) {
	if hot == nil || hot.entry == nil {
		return nil, false, nil
	}
	entry := hot.entry
	if entry.NotFound {
		return nil, true, ErrAPIKeyNotFound
	}
	if entry.Snapshot == nil || entry.Snapshot.Version != apiKeyAuthSnapshotVersion {
		return nil, false, nil
	}
	if hot.apiKey == nil || hot.apiKey.Key != key {
		return s.applyAuthCacheEntry(key, entry)
	}
	return hot.apiKey, true, nil
}

func (s *APIKeyService) clearAuthHotCacheEntry(cacheKey string) {
	if s == nil || len(cacheKey) != sha256.Size*2 {
		return
	}
	decoded, err := hex.DecodeString(cacheKey)
	if err != nil || len(decoded) != sha256.Size {
		return
	}
	var digest [sha256.Size]byte
	copy(digest[:], decoded)
	for {
		hot := s.authHotCache.Load()
		if hot == nil || hot.digest != digest {
			return
		}
		if s.authHotCache.CompareAndSwap(hot, nil) {
			return
		}
	}
}

func (s *APIKeyService) getAuthCacheEntry(ctx context.Context, cacheKey string) (*APIKeyAuthCacheEntry, bool) {
	if s.authCacheL1 != nil {
		if val, ok := s.authCacheL1.Get(cacheKey); ok {
			if entry, ok := val.(*APIKeyAuthCacheEntry); ok {
				return entry, true
			}
		}
	}
	if s.authNegativeCacheL1 != nil {
		if val, ok := s.authNegativeCacheL1.Get(cacheKey); ok {
			if entry, ok := val.(*APIKeyAuthCacheEntry); ok && entry.NotFound {
				return entry, true
			}
		}
	}
	if s.cache == nil || !s.authCfg.l2Enabled() {
		return nil, false
	}
	entry, err := s.cache.GetAuthCache(ctx, cacheKey)
	if err != nil {
		return nil, false
	}
	s.setAuthCacheL1(cacheKey, entry)
	return entry, true
}

func (s *APIKeyService) setAuthCacheL1(cacheKey string, entry *APIKeyAuthCacheEntry) {
	if entry == nil {
		return
	}
	if entry.NotFound {
		if s.authNegativeCacheL1 != nil && s.authCfg.negativeTTL > 0 {
			_ = s.authNegativeCacheL1.SetWithTTL(cacheKey, entry, 1, s.authCfg.jitterTTL(s.authCfg.negativeTTL))
		}
		return
	}
	if s.authCacheL1 == nil {
		return
	}
	ttl := s.authCfg.l1TTL
	ttl = s.authCfg.jitterTTL(ttl)
	_ = s.authCacheL1.SetWithTTL(cacheKey, entry, 1, ttl)
}

func (s *APIKeyService) setAuthCacheEntry(ctx context.Context, cacheKey string, entry *APIKeyAuthCacheEntry, ttl time.Duration) {
	if entry == nil {
		return
	}
	s.setAuthCacheL1(cacheKey, entry)
	if s.cache == nil || !s.authCfg.l2Enabled() {
		return
	}
	_ = s.cache.SetAuthCache(ctx, cacheKey, entry, s.authCfg.jitterTTL(ttl))
}

func (s *APIKeyService) deleteAuthCache(ctx context.Context, cacheKey string) {
	s.clearAuthHotCacheEntry(cacheKey)
	if s.authCacheL1 != nil {
		s.authCacheL1.Del(cacheKey)
	}
	if s.authNegativeCacheL1 != nil {
		s.authNegativeCacheL1.Del(cacheKey)
	}
	if s.cache == nil {
		return
	}
	_ = s.cache.DeleteAuthCache(ctx, cacheKey)
	// Publish invalidation message to other instances
	_ = s.cache.PublishAuthCacheInvalidation(ctx, cacheKey)
}

func (s *APIKeyService) loadAuthCacheEntry(ctx context.Context, key, cacheKey string) (*APIKeyAuthCacheEntry, error) {
	apiKey, err := s.lookupAPIKeyForAuth(ctx, key)
	if err != nil {
		if errors.Is(err, ErrAPIKeyNotFound) {
			entry := &APIKeyAuthCacheEntry{NotFound: true}
			if s.authCfg.negativeEnabled() {
				// Invalid keys are attacker-controlled and high-cardinality. Keep their
				// negative entries in the bounded process-local cache; do not amplify
				// random-key scans into Redis writes on every instance.
				s.setAuthCacheL1(cacheKey, entry)
			}
			return entry, nil
		}
		return nil, fmt.Errorf("get api key: %w", err)
	}
	apiKey.Key = key
	snapshot := s.snapshotFromAPIKey(ctx, apiKey)
	if snapshot == nil {
		return nil, fmt.Errorf("get api key: %w", ErrAPIKeyNotFound)
	}
	entry := &APIKeyAuthCacheEntry{Snapshot: snapshot}
	s.setAuthCacheEntry(ctx, cacheKey, entry, s.authCfg.l2TTL)
	return entry, nil
}

func (s *APIKeyService) lookupAPIKeyForAuth(ctx context.Context, key string) (*APIKey, error) {
	if s == nil || s.apiKeyRepo == nil {
		return nil, ErrAPIKeyNotFound
	}
	if s.authLookupSlots == nil {
		return s.apiKeyRepo.GetByKeyForAuth(ctx, key)
	}
	s.authLookupTotal.Add(1)
	select {
	case s.authLookupSlots <- struct{}{}:
		s.authLookupInFlight.Add(1)
		defer func() {
			s.authLookupInFlight.Add(-1)
			<-s.authLookupSlots
		}()
	case <-ctx.Done():
		return nil, ctx.Err()
	default:
		s.authLookupRejected.Add(1)
		return nil, ErrAPIKeyAuthOverloaded
	}
	return s.apiKeyRepo.GetByKeyForAuth(ctx, key)
}

func (s *APIKeyService) applyAuthCacheEntry(key string, entry *APIKeyAuthCacheEntry) (*APIKey, bool, error) {
	if entry == nil {
		return nil, false, nil
	}
	if entry.NotFound {
		return nil, true, ErrAPIKeyNotFound
	}
	if entry.Snapshot == nil {
		return nil, false, nil
	}
	if entry.Snapshot.Version != apiKeyAuthSnapshotVersion {
		return nil, false, nil
	}
	prototype := s.authCacheRuntimeAPIKey(entry)
	if prototype == nil {
		return nil, false, nil
	}
	apiKey := *prototype
	apiKey.Key = key
	return &apiKey, true, nil
}

func (s *APIKeyService) authCacheRuntimeAPIKey(entry *APIKeyAuthCacheEntry) *APIKey {
	if entry == nil || entry.Snapshot == nil {
		return nil
	}
	if prototype := entry.runtimeAPIKey.Load(); prototype != nil {
		return prototype
	}
	entry.runtimeMu.Lock()
	defer entry.runtimeMu.Unlock()
	if prototype := entry.runtimeAPIKey.Load(); prototype != nil {
		return prototype
	}
	prototype := s.snapshotToAPIKey("", entry.Snapshot)
	if prototype != nil {
		// User, Group, compiled IP rules, and nested routing config are immutable for
		// the lifetime of an auth-cache entry. Invalidation replaces the whole entry.
		entry.runtimeAPIKey.Store(prototype)
	}
	return prototype
}

func (s *APIKeyService) snapshotFromAPIKey(_ context.Context, apiKey *APIKey) *APIKeyAuthSnapshot {
	if apiKey == nil || apiKey.User == nil {
		return nil
	}
	snapshot := &APIKeyAuthSnapshot{
		Version:          apiKeyAuthSnapshotVersion,
		APIKeyID:         apiKey.ID,
		UserID:           apiKey.UserID,
		GroupID:          apiKey.GroupID,
		Name:             apiKey.Name,
		Status:           apiKey.Status,
		IPWhitelist:      apiKey.IPWhitelist,
		IPBlacklist:      apiKey.IPBlacklist,
		ExpiresAt:        apiKey.ExpiresAt,
		ConcurrencyLimit: apiKey.ConcurrencyLimit,
		User: APIKeyAuthUserSnapshot{
			ID:             apiKey.User.ID,
			Status:         apiKey.User.Status,
			Role:           apiKey.User.Role,
			Concurrency:    apiKey.User.Concurrency,
			SchedulingTier: NormalizeRequestSchedulingTier(apiKey.User.SchedulingTier),
			Email:          apiKey.User.Email,
			Username:       apiKey.User.Username,
		},
	}
	if apiKey.Group != nil {
		snapshot.Group = &APIKeyAuthGroupSnapshot{
			ID:                              apiKey.Group.ID,
			Name:                            apiKey.Group.Name,
			Platform:                        apiKey.Group.Platform,
			Status:                          apiKey.Group.Status,
			RateMultiplier:                  apiKey.Group.RateMultiplier,
			AllowImageGeneration:            apiKey.Group.AllowImageGeneration,
			OpenAIForceImageTool:            apiKey.Group.OpenAIForceImageTool,
			ImageRateIndependent:            apiKey.Group.ImageRateIndependent,
			ImageRateMultiplier:             apiKey.Group.ImageRateMultiplier,
			ImagePrice1K:                    apiKey.Group.ImagePrice1K,
			ImagePrice2K:                    apiKey.Group.ImagePrice2K,
			ImagePrice4K:                    apiKey.Group.ImagePrice4K,
			VideoRateIndependent:            apiKey.Group.VideoRateIndependent,
			VideoRateMultiplier:             apiKey.Group.VideoRateMultiplier,
			VideoPrice480P:                  apiKey.Group.VideoPrice480P,
			VideoPrice720P:                  apiKey.Group.VideoPrice720P,
			VideoPrice1080P:                 apiKey.Group.VideoPrice1080P,
			WebSearchPricePerCall:           apiKey.Group.WebSearchPricePerCall,
			ClaudeCodeOnly:                  apiKey.Group.ClaudeCodeOnly,
			FallbackGroupID:                 apiKey.Group.FallbackGroupID,
			FallbackGroupIDOnInvalidRequest: apiKey.Group.FallbackGroupIDOnInvalidRequest,
			ModelRouting:                    apiKey.Group.ModelRouting,
			ModelRoutingEnabled:             apiKey.Group.ModelRoutingEnabled,
			MCPXMLInject:                    apiKey.Group.MCPXMLInject,
			SupportedModelScopes:            apiKey.Group.SupportedModelScopes,
			AllowMessagesDispatch:           apiKey.Group.AllowMessagesDispatch,
			AllowLive:                       apiKey.Group.AllowLive,
			DefaultMappedModel:              apiKey.Group.DefaultMappedModel,
			MessagesDispatchModelConfig:     apiKey.Group.MessagesDispatchModelConfig,
			ModelsListConfig:                apiKey.Group.ModelsListConfig,
			MaxReasoningEffort:              apiKey.Group.MaxReasoningEffort,
			ReasoningEffortMappings:         apiKey.Group.ReasoningEffortMappings,
			ProfitControlEnabled:            apiKey.Group.ProfitControlEnabled,
			ProfitMinMargin:                 apiKey.Group.ProfitMinMargin,
			ProfitSafetyBuffer:              apiKey.Group.ProfitSafetyBuffer,
		}
	}
	return snapshot
}

func (s *APIKeyService) snapshotToAPIKey(key string, snapshot *APIKeyAuthSnapshot) *APIKey {
	if snapshot == nil {
		return nil
	}
	apiKey := &APIKey{
		ID:               snapshot.APIKeyID,
		UserID:           snapshot.UserID,
		GroupID:          snapshot.GroupID,
		Key:              key,
		Name:             snapshot.Name,
		Status:           snapshot.Status,
		IPWhitelist:      snapshot.IPWhitelist,
		IPBlacklist:      snapshot.IPBlacklist,
		ExpiresAt:        snapshot.ExpiresAt,
		ConcurrencyLimit: snapshot.ConcurrencyLimit,
		User: &User{
			ID:             snapshot.User.ID,
			Status:         snapshot.User.Status,
			Role:           snapshot.User.Role,
			Concurrency:    snapshot.User.Concurrency,
			SchedulingTier: NormalizeRequestSchedulingTier(snapshot.User.SchedulingTier),
			Email:          snapshot.User.Email,
			Username:       snapshot.User.Username,
		},
	}
	if snapshot.Group != nil {
		apiKey.Group = &Group{
			ID:                              snapshot.Group.ID,
			Name:                            snapshot.Group.Name,
			Platform:                        snapshot.Group.Platform,
			Status:                          snapshot.Group.Status,
			Hydrated:                        true,
			RateMultiplier:                  snapshot.Group.RateMultiplier,
			AllowImageGeneration:            snapshot.Group.AllowImageGeneration,
			OpenAIForceImageTool:            snapshot.Group.OpenAIForceImageTool,
			ImageRateIndependent:            snapshot.Group.ImageRateIndependent,
			ImageRateMultiplier:             snapshot.Group.ImageRateMultiplier,
			ImagePrice1K:                    snapshot.Group.ImagePrice1K,
			ImagePrice2K:                    snapshot.Group.ImagePrice2K,
			ImagePrice4K:                    snapshot.Group.ImagePrice4K,
			VideoRateIndependent:            snapshot.Group.VideoRateIndependent,
			VideoRateMultiplier:             snapshot.Group.VideoRateMultiplier,
			VideoPrice480P:                  snapshot.Group.VideoPrice480P,
			VideoPrice720P:                  snapshot.Group.VideoPrice720P,
			VideoPrice1080P:                 snapshot.Group.VideoPrice1080P,
			WebSearchPricePerCall:           snapshot.Group.WebSearchPricePerCall,
			ClaudeCodeOnly:                  snapshot.Group.ClaudeCodeOnly,
			FallbackGroupID:                 snapshot.Group.FallbackGroupID,
			FallbackGroupIDOnInvalidRequest: snapshot.Group.FallbackGroupIDOnInvalidRequest,
			ModelRouting:                    snapshot.Group.ModelRouting,
			ModelRoutingEnabled:             snapshot.Group.ModelRoutingEnabled,
			MCPXMLInject:                    snapshot.Group.MCPXMLInject,
			SupportedModelScopes:            snapshot.Group.SupportedModelScopes,
			AllowMessagesDispatch:           snapshot.Group.AllowMessagesDispatch,
			AllowLive:                       snapshot.Group.AllowLive,
			DefaultMappedModel:              snapshot.Group.DefaultMappedModel,
			MessagesDispatchModelConfig:     snapshot.Group.MessagesDispatchModelConfig,
			ModelsListConfig:                snapshot.Group.ModelsListConfig,
			MaxReasoningEffort:              snapshot.Group.MaxReasoningEffort,
			ReasoningEffortMappings:         snapshot.Group.ReasoningEffortMappings,
			ProfitControlEnabled:            snapshot.Group.ProfitControlEnabled,
			ProfitMinMargin:                 snapshot.Group.ProfitMinMargin,
			ProfitSafetyBuffer:              snapshot.Group.ProfitSafetyBuffer,
		}
	}
	s.compileAPIKeyIPRules(apiKey)
	return apiKey
}
