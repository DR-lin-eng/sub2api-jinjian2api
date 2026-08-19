package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"html"
	"sort"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/Wei-Shaw/sub2api/internal/shared/ip"
	"github.com/Wei-Shaw/sub2api/internal/shared/pagination"
	"github.com/Wei-Shaw/sub2api/internal/shared/timezone"
	"github.com/dgraph-io/ristretto"
	"golang.org/x/sync/singleflight"
)

var (
	ErrAPIKeyNotFound                = infraerrors.NotFound("API_KEY_NOT_FOUND", "api key not found")
	ErrGroupNotAllowed               = infraerrors.Forbidden("GROUP_NOT_ALLOWED", "user is not allowed to bind this group")
	ErrAPIKeyExists                  = infraerrors.Conflict("API_KEY_EXISTS", "api key already exists")
	ErrAPIKeyTooShort                = infraerrors.BadRequest("API_KEY_TOO_SHORT", "api key must be at least 16 characters")
	ErrAPIKeyInvalidChars            = infraerrors.BadRequest("API_KEY_INVALID_CHARS", "api key can only contain letters, numbers, underscores, and hyphens")
	ErrAPIKeyInvalidConcurrencyLimit = infraerrors.BadRequest("API_KEY_INVALID_CONCURRENCY_LIMIT", "api key concurrency limit cannot be negative")
	ErrAPIKeyRateLimited             = infraerrors.TooManyRequests("API_KEY_RATE_LIMITED", "too many failed attempts, please try again later")
	ErrAPIKeyAuthOverloaded          = infraerrors.ServiceUnavailable("API_KEY_AUTH_OVERLOADED", "api key authentication is temporarily overloaded")
	ErrInvalidIPPattern              = infraerrors.BadRequest("INVALID_IP_PATTERN", "invalid IP or CIDR pattern")
	ErrAPIKeyGroupNotBound           = infraerrors.NotFound("API_KEY_GROUP_NOT_BOUND", "api key is not bound to a group")
	// ErrAPIKeyExpired        = infraerrors.Forbidden("API_KEY_EXPIRED", "api key has expired")
	ErrAPIKeyExpired = infraerrors.Forbidden("API_KEY_EXPIRED", "api key 已过期")
)

const (
	MaxAPIKeyCredentialBytes     = 128
	defaultAuthLookupConcurrency = 64
	defaultNegativeAuthCacheSize = 16384
	apiKeyMaxErrorsPerHour       = 20
	apiKeyLastUsedMinTouch       = 30 * time.Second
	apiKeySortCurrentConcurrency = "current_concurrency"
	// DB 写失败后的短退避，避免请求路径持续同步重试造成写风暴与高延迟。
	apiKeyLastUsedFailBackoff = 5 * time.Second
)

// APIKeyUpdateFields 声明 APIKeyRepository.Update 允许写回的列。
//
// 调用方必须显式声明要改的列，避免编辑 Key 时覆盖并发更新的状态。
type APIKeyUpdateFields struct {
	Name             bool
	Status           bool
	GroupID          bool
	ExpiresAt        bool
	ConcurrencyLimit bool
	// IPRules 覆盖 ip_whitelist 与 ip_blacklist。
	IPRules bool
}

// IsEmpty 报告该次 Update 是否不写任何列。
func (f APIKeyUpdateFields) IsEmpty() bool {
	return f == APIKeyUpdateFields{}
}

type APIKeyRepository interface {
	Create(ctx context.Context, key *APIKey) error
	GetByID(ctx context.Context, id int64) (*APIKey, error)
	// GetKeyAndOwnerID 仅获取 API Key 的 key 与所有者 ID，用于删除等轻量场景
	GetKeyAndOwnerID(ctx context.Context, id int64) (string, int64, error)
	GetByKey(ctx context.Context, key string) (*APIKey, error)
	// GetByKeyForAuth 认证专用查询，返回最小字段集
	GetByKeyForAuth(ctx context.Context, key string) (*APIKey, error)
	// Update 只写 fields 中显式声明的列，其余列保持库中当前值。
	Update(ctx context.Context, key *APIKey, fields APIKeyUpdateFields) error
	Delete(ctx context.Context, id int64) error
	// DeleteWithAudit keeps the legacy interface name for rolling-upgrade compatibility.
	// Implementations must tombstone the key and soft-delete it atomically without
	// retaining the deleted credential material.
	DeleteWithAudit(ctx context.Context, id int64) error

	ListByUserID(ctx context.Context, userID int64, params pagination.PaginationParams, filters APIKeyListFilters) ([]APIKey, *pagination.PaginationResult, error)
	VerifyOwnership(ctx context.Context, userID int64, apiKeyIDs []int64) ([]int64, error)
	CountByUserID(ctx context.Context, userID int64) (int64, error)
	ExistsByKey(ctx context.Context, key string) (bool, error)
	ListByGroupID(ctx context.Context, groupID int64, params pagination.PaginationParams) ([]APIKey, *pagination.PaginationResult, error)
	SearchAPIKeys(ctx context.Context, userID int64, keyword string, limit int) ([]APIKey, error)
	ClearGroupIDByGroupID(ctx context.Context, groupID int64) (int64, error)
	// UpdateGroupIDByUserAndGroup 将用户下绑定 oldGroupID 的所有 Key 迁移到 newGroupID
	UpdateGroupIDByUserAndGroup(ctx context.Context, userID, oldGroupID, newGroupID int64) (int64, error)
	CountByGroupID(ctx context.Context, groupID int64) (int64, error)
	ListKeysByUserID(ctx context.Context, userID int64) ([]string, error)
	ListKeysByGroupID(ctx context.Context, groupID int64) ([]string, error)

	UpdateLastUsed(ctx context.Context, id int64, usedAt time.Time) error
}

type apiKeyAllByUserIDLister interface {
	ListAllByUserID(ctx context.Context, userID int64, filters APIKeyListFilters) ([]APIKey, error)
}

// APIKeyCache defines cache operations for API key service
type APIKeyCache interface {
	GetCreateAttemptCount(ctx context.Context, userID int64) (int, error)
	IncrementCreateAttemptCount(ctx context.Context, userID int64) error
	DeleteCreateAttemptCount(ctx context.Context, userID int64) error

	IncrementDailyUsage(ctx context.Context, apiKey string) error
	SetDailyUsageExpiry(ctx context.Context, apiKey string, ttl time.Duration) error

	GetAuthCache(ctx context.Context, key string) (*APIKeyAuthCacheEntry, error)
	SetAuthCache(ctx context.Context, key string, entry *APIKeyAuthCacheEntry, ttl time.Duration) error
	DeleteAuthCache(ctx context.Context, key string) error

	// Pub/Sub for L1 cache invalidation across instances
	PublishAuthCacheInvalidation(ctx context.Context, cacheKey string) error
	SubscribeAuthCacheInvalidation(ctx context.Context, handler func(cacheKey string)) error
}

type APIKeyLastUsedScheduler interface {
	ScheduleAPIKeyLastUsedUpdate(apiKeyID int64, usedAt time.Time) bool
	CancelAPIKeyLastUsedUpdate(apiKeyID int64)
}

type authCacheSubscriptionReadyKey struct{}

func withAuthCacheSubscriptionReady(ctx context.Context, ready func()) context.Context {
	return context.WithValue(ctx, authCacheSubscriptionReadyKey{}, ready)
}

// NotifyAuthCacheSubscriptionReady lets cache implementations report that the
// server acknowledged the subscription without widening the public cache API.
func NotifyAuthCacheSubscriptionReady(ctx context.Context) {
	if ready, ok := ctx.Value(authCacheSubscriptionReadyKey{}).(func()); ok && ready != nil {
		ready()
	}
}

// APIKeyAuthCacheInvalidator 提供认证缓存失效能力
type APIKeyAuthCacheInvalidator interface {
	InvalidateAuthCacheByKey(ctx context.Context, key string)
	InvalidateAuthCacheByUserID(ctx context.Context, userID int64)
	InvalidateAuthCacheByGroupID(ctx context.Context, groupID int64)
}

// CreateAPIKeyRequest 创建API Key请求
type CreateAPIKeyRequest struct {
	Name        string   `json:"name"`
	GroupID     *int64   `json:"group_id"`
	CustomKey   *string  `json:"custom_key"`   // 可选的自定义key
	IPWhitelist []string `json:"ip_whitelist"` // IP 白名单
	IPBlacklist []string `json:"ip_blacklist"` // IP 黑名单

	ExpiresInDays *int `json:"expires_in_days"` // Days until expiry (nil = never expires)
}

// UpdateAPIKeyRequest 更新API Key请求
type UpdateAPIKeyRequest struct {
	Name        *string   `json:"name"`
	GroupID     *int64    `json:"group_id"`
	Status      *string   `json:"status"`
	IPWhitelist *[]string `json:"ip_whitelist"` // IP 白名单（nil 不修改，空数组清空）
	IPBlacklist *[]string `json:"ip_blacklist"` // IP 黑名单（nil 不修改，空数组清空）

	ExpiresAt        *time.Time `json:"expires_at"`        // Expiration time (nil = no change)
	ClearExpiration  bool       `json:"-"`                 // Clear expiration (internal use)
	ConcurrencyLimit *int       `json:"concurrency_limit"` // nil = no change, 0 = unlimited
}

// APIKeyGroupRateInfo describes the effective group billing multiplier for one
// authenticated API key.
type APIKeyGroupRateInfo struct {
	APIKeyID            int64   `json:"api_key_id"`
	GroupID             int64   `json:"group_id"`
	GroupName           string  `json:"group_name"`
	Platform            string  `json:"platform"`
	RateMultiplier      float64 `json:"rate_multiplier"`
	GroupRateMultiplier float64 `json:"group_rate_multiplier"`
	Source              string  `json:"source"`
	Bound               bool    `json:"bound"`
}

// APIKeyService API Key服务
type APIKeyService struct {
	apiKeyRepo                APIKeyRepository
	userRepo                  UserRepository
	groupRepo                 GroupRepository
	cache                     APIKeyCache
	concurrencyService        *ConcurrencyService
	cfg                       *config.Config
	authCacheL1               *ristretto.Cache
	authNegativeCacheL1       *ristretto.Cache
	authHotCache              atomic.Pointer[apiKeyAuthHotCacheEntry]
	authCfg                   apiKeyAuthCacheConfig
	authGroup                 singleflight.Group
	authLookupSlots           chan struct{}
	authLookupTotal           atomic.Uint64
	authLookupRejected        atomic.Uint64
	authLookupInFlight        atomic.Int64
	authInvalidationStart     sync.Once
	authInvalidationStop      sync.Once
	authInvalidationCancel    context.CancelFunc
	authInvalidationWG        sync.WaitGroup
	authInvalidationConnected atomic.Bool
	authInvalidationFailures  atomic.Uint64
	lastUsedTouchL1           apiKeyLastUsedDebounceCache
	lastUsedTouchSF           singleflight.Group
	lastUsedScheduler         APIKeyLastUsedScheduler
}

type APIKeyAuthLookupMetrics struct {
	Total    uint64 `json:"total"`
	Rejected uint64 `json:"rejected"`
	InFlight int64  `json:"in_flight"`
	Capacity int    `json:"capacity"`
}

func (s *APIKeyService) AuthLookupMetrics() APIKeyAuthLookupMetrics {
	if s == nil {
		return APIKeyAuthLookupMetrics{}
	}
	return APIKeyAuthLookupMetrics{
		Total:    s.authLookupTotal.Load(),
		Rejected: s.authLookupRejected.Load(),
		InFlight: s.authLookupInFlight.Load(),
		Capacity: cap(s.authLookupSlots),
	}
}

// NewAPIKeyService 创建API Key服务实例
func NewAPIKeyService(
	apiKeyRepo APIKeyRepository,
	userRepo UserRepository,
	groupRepo GroupRepository,
	cache APIKeyCache,
	cfg *config.Config,
) *APIKeyService {
	svc := &APIKeyService{
		apiKeyRepo: apiKeyRepo,
		userRepo:   userRepo,
		groupRepo:  groupRepo,
		cache:      cache,
		cfg:        cfg,
	}
	svc.initAuthCache(cfg)
	lookupConcurrency := defaultAuthLookupConcurrency
	if cfg != nil && cfg.APIKeyAuth.LookupConcurrency > 0 {
		lookupConcurrency = cfg.APIKeyAuth.LookupConcurrency
	}
	svc.authLookupSlots = make(chan struct{}, lookupConcurrency)
	return svc
}

func (s *APIKeyService) SetConcurrencyService(concurrencyService *ConcurrencyService) {
	s.concurrencyService = concurrencyService
}

func (s *APIKeyService) SetLastUsedScheduler(scheduler APIKeyLastUsedScheduler) {
	s.lastUsedScheduler = scheduler
}

func (s *APIKeyService) compileAPIKeyIPRules(apiKey *APIKey) {
	if apiKey == nil {
		return
	}
	apiKey.CompiledIPWhitelist = ip.CompileIPRules(apiKey.IPWhitelist)
	apiKey.CompiledIPBlacklist = ip.CompileIPRules(apiKey.IPBlacklist)
}

// GenerateKey 生成随机API Key
func (s *APIKeyService) GenerateKey() (string, error) {
	// 生成32字节随机数据
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("generate random bytes: %w", err)
	}

	// 转换为十六进制字符串并添加前缀
	prefix := s.cfg.Default.APIKeyPrefix
	if prefix == "" {
		prefix = "sk-"
	}

	key := prefix + hex.EncodeToString(bytes)
	return key, nil
}

// ValidateCustomKey 验证自定义API Key格式
func (s *APIKeyService) ValidateCustomKey(key string) error {
	// 检查长度
	if len(key) < 16 {
		return ErrAPIKeyTooShort
	}

	// 检查字符：只允许字母、数字、下划线、连字符
	for _, c := range key {
		if (c >= 'a' && c <= 'z') ||
			(c >= 'A' && c <= 'Z') ||
			(c >= '0' && c <= '9') ||
			c == '_' || c == '-' {
			continue
		}
		return ErrAPIKeyInvalidChars
	}

	return nil
}

// checkAPIKeyRateLimit 检查用户创建自定义Key的错误次数是否超限
func (s *APIKeyService) checkAPIKeyRateLimit(ctx context.Context, userID int64) error {
	if s.cache == nil {
		return nil
	}

	count, err := s.cache.GetCreateAttemptCount(ctx, userID)
	if err != nil {
		// Redis 出错时不阻止用户操作
		return nil
	}

	if count >= apiKeyMaxErrorsPerHour {
		return ErrAPIKeyRateLimited
	}

	return nil
}

// incrementAPIKeyErrorCount 增加用户创建自定义Key的错误计数
func (s *APIKeyService) incrementAPIKeyErrorCount(ctx context.Context, userID int64) {
	if s.cache == nil {
		return
	}

	_ = s.cache.IncrementCreateAttemptCount(ctx, userID)
}

// canUserBindGroup exists as a narrow compatibility helper for API-key writes.
// The sole local administrator can bind every active group.
func (s *APIKeyService) canUserBindGroup(ctx context.Context, user *User, group *Group) bool {
	_ = ctx
	return user != nil && group != nil
}

// Create 创建API Key
func (s *APIKeyService) Create(ctx context.Context, userID int64, req CreateAPIKeyRequest) (*APIKey, error) {
	// 验证用户存在
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}

	// 验证 IP 白名单格式
	if len(req.IPWhitelist) > 0 {
		if invalid := ip.ValidateIPPatterns(req.IPWhitelist); len(invalid) > 0 {
			return nil, fmt.Errorf("%w: %v", ErrInvalidIPPattern, invalid)
		}
	}

	// 验证 IP 黑名单格式
	if len(req.IPBlacklist) > 0 {
		if invalid := ip.ValidateIPPatterns(req.IPBlacklist); len(invalid) > 0 {
			return nil, fmt.Errorf("%w: %v", ErrInvalidIPPattern, invalid)
		}
	}

	// 验证分组权限（如果指定了分组）
	if req.GroupID != nil {
		group, err := s.groupRepo.GetByID(ctx, *req.GroupID)
		if err != nil {
			return nil, fmt.Errorf("get group: %w", err)
		}

		// 检查用户是否可以绑定该分组
		if !s.canUserBindGroup(ctx, user, group) {
			return nil, ErrGroupNotAllowed
		}
	}

	var key string

	// 判断是否使用自定义Key
	if req.CustomKey != nil && *req.CustomKey != "" {
		// 检查限流（仅对自定义key进行限流）
		if err := s.checkAPIKeyRateLimit(ctx, userID); err != nil {
			return nil, err
		}

		// 验证自定义Key格式
		if err := s.ValidateCustomKey(*req.CustomKey); err != nil {
			return nil, err
		}

		// 检查Key是否已存在
		exists, err := s.apiKeyRepo.ExistsByKey(ctx, *req.CustomKey)
		if err != nil {
			return nil, fmt.Errorf("check key exists: %w", err)
		}
		if exists {
			// Key已存在，增加错误计数
			s.incrementAPIKeyErrorCount(ctx, userID)
			return nil, ErrAPIKeyExists
		}

		key = *req.CustomKey
	} else {
		// 生成随机API Key
		var err error
		key, err = s.GenerateKey()
		if err != nil {
			return nil, fmt.Errorf("generate key: %w", err)
		}
	}

	// 创建API Key记录
	apiKey := &APIKey{
		UserID:      userID,
		Key:         key,
		Name:        html.EscapeString(req.Name),
		GroupID:     req.GroupID,
		Status:      StatusActive,
		IPWhitelist: req.IPWhitelist,
		IPBlacklist: req.IPBlacklist,
	}

	// Set expiration time if specified
	if req.ExpiresInDays != nil && *req.ExpiresInDays > 0 {
		expiresAt := time.Now().AddDate(0, 0, *req.ExpiresInDays)
		apiKey.ExpiresAt = &expiresAt
	}

	if err := s.apiKeyRepo.Create(ctx, apiKey); err != nil {
		return nil, fmt.Errorf("create api key: %w", err)
	}

	s.InvalidateAuthCacheByKey(ctx, apiKey.Key)
	s.compileAPIKeyIPRules(apiKey)

	return apiKey, nil
}

// List 获取用户的API Key列表
func (s *APIKeyService) List(ctx context.Context, userID int64, params pagination.PaginationParams, filters APIKeyListFilters) ([]APIKey, *pagination.PaginationResult, error) {
	if normalizedAPIKeySortBy(params.SortBy) == apiKeySortCurrentConcurrency {
		return s.listByCurrentConcurrency(ctx, userID, params, filters)
	}

	keys, pagination, err := s.apiKeyRepo.ListByUserID(ctx, userID, params, filters)
	if err != nil {
		return nil, nil, fmt.Errorf("list api keys: %w", err)
	}
	s.fillCurrentConcurrency(ctx, keys)
	return keys, pagination, nil
}

func (s *APIKeyService) listByCurrentConcurrency(ctx context.Context, userID int64, params pagination.PaginationParams, filters APIKeyListFilters) ([]APIKey, *pagination.PaginationResult, error) {
	repo, ok := s.apiKeyRepo.(apiKeyAllByUserIDLister)
	if !ok {
		return nil, nil, fmt.Errorf("list api keys by current concurrency: repository does not support unpaginated API key listing")
	}

	keys, err := repo.ListAllByUserID(ctx, userID, filters)
	if err != nil {
		return nil, nil, fmt.Errorf("list api keys: %w", err)
	}
	s.fillCurrentConcurrency(ctx, keys)
	sortAPIKeysByCurrentConcurrency(keys, params.NormalizedSortOrder(pagination.SortOrderDesc))
	return paginateAPIKeys(keys, params), apiKeyPaginationResult(int64(len(keys)), params), nil
}

func normalizedAPIKeySortBy(sortBy string) string {
	return strings.ToLower(strings.TrimSpace(sortBy))
}

func sortAPIKeysByCurrentConcurrency(keys []APIKey, sortOrder string) {
	desc := sortOrder != pagination.SortOrderAsc
	sort.SliceStable(keys, func(i, j int) bool {
		if keys[i].CurrentConcurrency == keys[j].CurrentConcurrency {
			if desc {
				return keys[i].ID > keys[j].ID
			}
			return keys[i].ID < keys[j].ID
		}
		if desc {
			return keys[i].CurrentConcurrency > keys[j].CurrentConcurrency
		}
		return keys[i].CurrentConcurrency < keys[j].CurrentConcurrency
	})
}

func paginateAPIKeys(keys []APIKey, params pagination.PaginationParams) []APIKey {
	if len(keys) == 0 {
		return []APIKey{}
	}
	limit := params.Limit()
	page := params.Page
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit
	if offset >= len(keys) {
		return []APIKey{}
	}
	end := offset + limit
	if end > len(keys) {
		end = len(keys)
	}
	return keys[offset:end]
}

func apiKeyPaginationResult(total int64, params pagination.PaginationParams) *pagination.PaginationResult {
	limit := params.Limit()
	pages := int(total) / limit
	if int(total)%limit > 0 {
		pages++
	}
	return &pagination.PaginationResult{
		Total:    total,
		Page:     params.Page,
		PageSize: limit,
		Pages:    pages,
	}
}

func (s *APIKeyService) fillCurrentConcurrency(ctx context.Context, keys []APIKey) {
	if s == nil || s.concurrencyService == nil || len(keys) == 0 {
		return
	}
	ids := make([]int64, 0, len(keys))
	for i := range keys {
		if keys[i].ID > 0 {
			ids = append(ids, keys[i].ID)
		}
	}
	counts, err := s.concurrencyService.GetAPIKeyConcurrencyBatch(ctx, ids)
	if err != nil {
		return
	}
	for i := range keys {
		keys[i].CurrentConcurrency = counts[keys[i].ID]
	}
}

func (s *APIKeyService) currentConcurrencyForAPIKey(ctx context.Context, apiKeyID int64) int {
	if s == nil || s.concurrencyService == nil || apiKeyID <= 0 {
		return 0
	}
	counts, err := s.concurrencyService.GetAPIKeyConcurrencyBatch(ctx, []int64{apiKeyID})
	if err != nil {
		return 0
	}
	return counts[apiKeyID]
}

func (s *APIKeyService) VerifyOwnership(ctx context.Context, userID int64, apiKeyIDs []int64) ([]int64, error) {
	if len(apiKeyIDs) == 0 {
		return []int64{}, nil
	}

	validIDs, err := s.apiKeyRepo.VerifyOwnership(ctx, userID, apiKeyIDs)
	if err != nil {
		return nil, fmt.Errorf("verify api key ownership: %w", err)
	}
	return validIDs, nil
}

// GetByID 根据ID获取API Key
func (s *APIKeyService) GetByID(ctx context.Context, id int64) (*APIKey, error) {
	apiKey, err := s.apiKeyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get api key: %w", err)
	}
	s.compileAPIKeyIPRules(apiKey)
	if apiKey != nil {
		apiKey.CurrentConcurrency = s.currentConcurrencyForAPIKey(ctx, apiKey.ID)
	}
	return apiKey, nil
}

// GetByKey 根据Key字符串获取API Key（用于认证）
func (s *APIKeyService) GetByKey(ctx context.Context, key string) (*APIKey, error) {
	if len(key) == 0 || len(key) > MaxAPIKeyCredentialBytes {
		return nil, ErrAPIKeyNotFound
	}
	digest := authCacheDigest(key)
	if entry, ok := s.getAuthHotCacheEntry(digest, time.Now()); ok {
		if apiKey, used, err := s.applyAuthHotCacheEntry(key, entry); used {
			if err != nil {
				return nil, fmt.Errorf("get api key: %w", err)
			}
			return apiKey, nil
		}
	}
	cacheKey := authCacheKeyFromDigest(digest)

	if entry, ok := s.getAuthCacheEntry(ctx, cacheKey); ok {
		s.setAuthHotCacheEntry(digest, key, entry)
		if apiKey, used, err := s.applyAuthCacheEntry(key, entry); used {
			if err != nil {
				return nil, fmt.Errorf("get api key: %w", err)
			}
			return apiKey, nil
		}
	}

	if s.authCfg.singleflight {
		value, err, _ := s.authGroup.Do(cacheKey, func() (any, error) {
			return s.loadAuthCacheEntry(ctx, key, cacheKey)
		})
		if err != nil {
			return nil, err
		}
		entry, _ := value.(*APIKeyAuthCacheEntry)
		s.setAuthHotCacheEntry(digest, key, entry)
		if apiKey, used, err := s.applyAuthCacheEntry(key, entry); used {
			if err != nil {
				return nil, fmt.Errorf("get api key: %w", err)
			}
			return apiKey, nil
		}
	} else {
		entry, err := s.loadAuthCacheEntry(ctx, key, cacheKey)
		if err != nil {
			return nil, err
		}
		s.setAuthHotCacheEntry(digest, key, entry)
		if apiKey, used, err := s.applyAuthCacheEntry(key, entry); used {
			if err != nil {
				return nil, fmt.Errorf("get api key: %w", err)
			}
			return apiKey, nil
		}
	}

	apiKey, err := s.lookupAPIKeyForAuth(ctx, key)
	if err != nil {
		return nil, fmt.Errorf("get api key: %w", err)
	}
	apiKey.Key = key
	s.compileAPIKeyIPRules(apiKey)
	return apiKey, nil
}

// Update 更新API Key
func (s *APIKeyService) Update(ctx context.Context, id int64, userID int64, req UpdateAPIKeyRequest) (*APIKey, error) {
	if req.ConcurrencyLimit != nil && *req.ConcurrencyLimit < 0 {
		return nil, ErrAPIKeyInvalidConcurrencyLimit
	}

	apiKey, err := s.apiKeyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get api key: %w", err)
	}

	// 验证所有权
	if apiKey.UserID != userID {
		return nil, ErrInsufficientPerms
	}

	// 验证 IP 白名单格式
	if req.IPWhitelist != nil && len(*req.IPWhitelist) > 0 {
		if invalid := ip.ValidateIPPatterns(*req.IPWhitelist); len(invalid) > 0 {
			return nil, fmt.Errorf("%w: %v", ErrInvalidIPPattern, invalid)
		}
	}

	// 验证 IP 黑名单格式
	if req.IPBlacklist != nil && len(*req.IPBlacklist) > 0 {
		if invalid := ip.ValidateIPPatterns(*req.IPBlacklist); len(invalid) > 0 {
			return nil, fmt.Errorf("%w: %v", ErrInvalidIPPattern, invalid)
		}
	}

	// fields 只登记本次请求真正要改的列。quota_used 与 usage_5h/1d/7d 由计费热路径
	var fields APIKeyUpdateFields
	// 下面的清除过期分支可能顺带把 Status 改回 active，
	// 所以用原始值比对来决定是否写 status，而不是只看 req.Status。
	originalStatus := apiKey.Status

	// 更新字段
	if req.Name != nil {
		apiKey.Name = html.EscapeString(*req.Name)
		fields.Name = true
	}

	if req.GroupID != nil {
		// 验证分组权限
		user, err := s.userRepo.GetByID(ctx, userID)
		if err != nil {
			return nil, fmt.Errorf("get user: %w", err)
		}

		group, err := s.groupRepo.GetByID(ctx, *req.GroupID)
		if err != nil {
			return nil, fmt.Errorf("get group: %w", err)
		}

		if !s.canUserBindGroup(ctx, user, group) {
			return nil, ErrGroupNotAllowed
		}

		apiKey.GroupID = req.GroupID
		fields.GroupID = true
	}

	if req.Status != nil {
		apiKey.Status = *req.Status
		fields.Status = true
		// 如果状态改变，清除Redis缓存
		if s.cache != nil {
			_ = s.cache.DeleteCreateAttemptCount(ctx, apiKey.UserID)
		}
	}

	if req.ConcurrencyLimit != nil {
		apiKey.ConcurrencyLimit = *req.ConcurrencyLimit
		fields.ConcurrencyLimit = true
	}
	if req.ClearExpiration {
		apiKey.ExpiresAt = nil
		fields.ExpiresAt = true
		// If clearing expiry and status was expired, reactivate
		if apiKey.Status == StatusAPIKeyExpired {
			apiKey.Status = StatusActive
		}
	} else if req.ExpiresAt != nil {
		apiKey.ExpiresAt = req.ExpiresAt
		fields.ExpiresAt = true
		// If extending expiry and status was expired, reactivate
		if apiKey.Status == StatusAPIKeyExpired && time.Now().Before(*req.ExpiresAt) {
			apiKey.Status = StatusActive
		}
	}

	// 更新 IP 限制（nil 不修改，空数组清空设置）
	if req.IPWhitelist != nil {
		apiKey.IPWhitelist = *req.IPWhitelist
		fields.IPRules = true
	}
	if req.IPBlacklist != nil {
		apiKey.IPBlacklist = *req.IPBlacklist
		fields.IPRules = true
	}

	// 上面的自动复活分支可能改了 status，这里统一登记。
	if apiKey.Status != originalStatus {
		fields.Status = true
	}

	if err := s.apiKeyRepo.Update(ctx, apiKey, fields); err != nil {
		return nil, fmt.Errorf("update api key: %w", err)
	}

	s.InvalidateAuthCacheByKey(ctx, apiKey.Key)
	s.compileAPIKeyIPRules(apiKey)

	return apiKey, nil
}

// Delete 删除API Key
func (s *APIKeyService) Delete(ctx context.Context, id int64, userID int64) error {
	key, ownerID, err := s.apiKeyRepo.GetKeyAndOwnerID(ctx, id)
	if err != nil {
		return fmt.Errorf("get api key: %w", err)
	}

	// 验证当前用户是否为该 API Key 的所有者
	if ownerID != userID {
		return ErrInsufficientPerms
	}

	// 事务内:写审计 + 软删除(tombstone)。
	if err := s.apiKeyRepo.DeleteWithAudit(ctx, id); err != nil {
		return fmt.Errorf("delete api key: %w", err)
	}

	// 删除成功后再清理缓存,避免"缓存已清但删除失败"的竞态。
	if s.cache != nil {
		_ = s.cache.DeleteCreateAttemptCount(ctx, userID)
	}
	s.InvalidateAuthCacheByKey(ctx, key)
	s.lastUsedTouchL1.Delete(id)
	if s.lastUsedScheduler != nil {
		s.lastUsedScheduler.CancelAPIKeyLastUsedUpdate(id)
	}

	return nil
}

// ValidateKey 验证API Key是否有效（用于认证中间件）
func (s *APIKeyService) ValidateKey(ctx context.Context, key string) (*APIKey, *User, error) {
	// 获取API Key
	apiKey, err := s.GetByKey(ctx, key)
	if err != nil {
		return nil, nil, err
	}

	// 检查API Key状态
	if !apiKey.IsActive() {
		return nil, nil, infraerrors.Unauthorized("API_KEY_INACTIVE", "api key is not active")
	}

	// 获取用户信息
	user, err := s.userRepo.GetByID(ctx, apiKey.UserID)
	if err != nil {
		return nil, nil, fmt.Errorf("get user: %w", err)
	}

	// 检查用户状态
	if !user.IsActive() {
		return nil, nil, ErrUserNotActive
	}

	return apiKey, user, nil
}

// TouchLastUsed 通过防抖更新 api_keys.last_used_at，减少高频写放大。
// 该操作为尽力而为，不应阻塞主请求链路。
func (s *APIKeyService) TouchLastUsed(ctx context.Context, keyID int64) error {
	if keyID <= 0 {
		return nil
	}

	now := time.Now()
	if _, ok := s.lastUsedTouchL1.Get(keyID, now); ok {
		return nil
	}

	if s.lastUsedScheduler != nil {
		if s.lastUsedScheduler.ScheduleAPIKeyLastUsedUpdate(keyID, now) {
			s.lastUsedTouchL1.Store(keyID, now.Add(apiKeyLastUsedMinTouch))
		} else {
			s.lastUsedTouchL1.Store(keyID, now.Add(apiKeyLastUsedFailBackoff))
		}
		return nil
	}

	_, err, _ := s.lastUsedTouchSF.Do(strconv.FormatInt(keyID, 10), func() (any, error) {
		latest := time.Now()
		if _, ok := s.lastUsedTouchL1.Get(keyID, latest); ok {
			return nil, nil
		}

		if err := s.apiKeyRepo.UpdateLastUsed(ctx, keyID, latest); err != nil {
			s.lastUsedTouchL1.Store(keyID, latest.Add(apiKeyLastUsedFailBackoff))
			return nil, fmt.Errorf("touch api key last used: %w", err)
		}
		s.lastUsedTouchL1.Store(keyID, latest.Add(apiKeyLastUsedMinTouch))
		return nil, nil
	})
	return err
}

// IncrementUsage 增加API Key使用次数（可选：用于统计）
func (s *APIKeyService) IncrementUsage(ctx context.Context, keyID int64) error {
	// 使用Redis计数器
	if s.cache != nil {
		cacheKey := fmt.Sprintf("apikey:usage:%d:%s", keyID, timezone.Now().Format("2006-01-02"))
		if err := s.cache.IncrementDailyUsage(ctx, cacheKey); err != nil {
			return fmt.Errorf("increment usage: %w", err)
		}
		// 设置24小时过期
		_ = s.cache.SetDailyUsageExpiry(ctx, cacheKey, 24*time.Hour)
	}
	return nil
}

// GetAvailableGroups returns groups the local administrator can bind.
func (s *APIKeyService) GetAvailableGroups(ctx context.Context, userID int64) ([]Group, error) {
	// 获取用户信息
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}

	// 获取所有活跃分组
	allGroups, err := s.groupRepo.ListActive(ctx)
	if err != nil {
		return nil, fmt.Errorf("list active groups: %w", err)
	}

	// 过滤出用户有权限的分组
	availableGroups := make([]Group, 0)
	for _, group := range allGroups {
		if s.canUserBindGroup(ctx, user, &group) {
			availableGroups = append(availableGroups, group)
		}
	}

	return availableGroups, nil
}

func (s *APIKeyService) SearchAPIKeys(ctx context.Context, userID int64, keyword string, limit int) ([]APIKey, error) {
	keys, err := s.apiKeyRepo.SearchAPIKeys(ctx, userID, keyword, limit)
	if err != nil {
		return nil, fmt.Errorf("search api keys: %w", err)
	}
	return keys, nil
}

// GetAuthenticatedAPIKeyGroups returns group metadata for the authenticated key.
func (s *APIKeyService) GetAuthenticatedAPIKeyGroups(ctx context.Context, apiKey *APIKey) ([]APIKeyGroupRateInfo, error) {
	if s == nil || apiKey == nil {
		return nil, ErrAPIKeyNotFound
	}
	groups, err := s.GetAvailableGroups(ctx, apiKey.UserID)
	if err != nil {
		return nil, err
	}

	var boundGroupID int64
	if apiKey.GroupID != nil {
		boundGroupID = *apiKey.GroupID
	}

	out := make([]APIKeyGroupRateInfo, 0, len(groups))
	for i := range groups {
		out = append(out, apiKeyGroupRateInfo(apiKey.ID, groups[i], boundGroupID == groups[i].ID))
	}
	return out, nil
}

// GetAuthenticatedAPIKeyGroupRate returns the group multiplier bound to a key.
func (s *APIKeyService) GetAuthenticatedAPIKeyGroupRate(ctx context.Context, apiKey *APIKey) (*APIKeyGroupRateInfo, error) {
	_ = ctx
	if s == nil || apiKey == nil {
		return nil, ErrAPIKeyNotFound
	}
	if apiKey.GroupID == nil || apiKey.Group == nil {
		return nil, ErrAPIKeyGroupNotBound
	}

	group := apiKey.Group
	groupRate := group.RateMultiplier
	info := apiKeyGroupRateInfo(apiKey.ID, *group, true)
	info.RateMultiplier = groupRate
	info.GroupRateMultiplier = groupRate
	return &info, nil
}

func apiKeyGroupRateInfo(apiKeyID int64, group Group, bound bool) APIKeyGroupRateInfo {
	groupRate := group.RateMultiplier

	return APIKeyGroupRateInfo{
		APIKeyID:            apiKeyID,
		GroupID:             group.ID,
		GroupName:           group.Name,
		Platform:            group.Platform,
		RateMultiplier:      groupRate,
		GroupRateMultiplier: groupRate,
		Source:              "group_default",
		Bound:               bound,
	}
}

// CheckAPIKeyQuotaAndExpiry keeps the legacy name while checking key expiry only.
// Returns nil if valid, error if invalid
func (s *APIKeyService) CheckAPIKeyQuotaAndExpiry(apiKey *APIKey) error {
	// Check expiration
	if apiKey.IsExpired() {
		return ErrAPIKeyExpired
	}

	return nil
}
