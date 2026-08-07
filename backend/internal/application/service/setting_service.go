package service

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/Wei-Shaw/sub2api/internal/shared/ip"
	"golang.org/x/sync/singleflight"
)

var (
	ErrSettingNotFound = infraerrors.NotFound("SETTING_NOT_FOUND", "setting not found")
)

type SettingRepository interface {
	Get(ctx context.Context, key string) (*Setting, error)
	GetValue(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key, value string) error
	GetMultiple(ctx context.Context, keys []string) (map[string]string, error)
	SetMultiple(ctx context.Context, settings map[string]string) error
	GetAll(ctx context.Context) (map[string]string, error)
	Delete(ctx context.Context, key string) error
}

// WebSearchManagerBuilder creates a websearch.Manager from config (injected by infra layer).
// proxyURLs maps proxy ID to resolved URL for provider-level proxy support.
type WebSearchManagerBuilder func(cfg *WebSearchEmulationConfig, proxyURLs map[int64]string)

type SchedulerEngineSwitcher interface {
	SetSchedulerV2Enabled(ctx context.Context, enabled bool, candidateLimit, scanLimit int) error
	SchedulerEngineState(ctx context.Context) SchedulerEngineState
	ConfigureSchedulerV2Limits(ctx context.Context, candidateLimit, scanLimit int) error
	SchedulerV2Limits() (candidateLimit, scanLimit int)
}

// SettingService 系统设置服务
type SettingService struct {
	settingRepo                 SettingRepository
	proxyRepo                   ProxyRepository // for resolving websearch provider proxy URLs
	cfg                         *config.Config
	onUpdate                    func() // Callback when settings are updated (for cache invalidation)
	version                     string // Application version
	webSearchManagerBuilder     WebSearchManagerBuilder
	schedulerEngineSwitcher     SchedulerEngineSwitcher
	clientIPResolver            *ip.Resolver
	antigravityUAVersionCache   atomic.Value // *cachedAntigravityUserAgentVersion
	antigravityUAVersionSF      singleflight.Group
	openAICodexUACache          atomic.Value // *cachedOpenAICodexUserAgent
	openAICodexUASF             singleflight.Group
	openAICodexVersionCache     atomic.Value // *cachedOpenAICodexClientVersion
	openAICodexVersionSF        singleflight.Group
	codexRestrictionPolicyCache atomic.Value // *cachedCodexRestrictionPolicy
	codexRestrictionPolicySF    singleflight.Group
	adminAPIKeyMu               sync.Mutex

	cyberSessionBlockRuntimeCache atomic.Value // *cachedCyberSessionBlockRuntime
	cyberSessionBlockRuntimeSF    singleflight.Group

	// panelRateLimitCache 面板 API 限流配置进程内缓存（*cachedPanelRateLimitSettings）。
	// 面板每个认证请求都会读取，禁止在热路径上直接访问 DB。
	panelRateLimitCache           atomic.Value
	panelRateLimitRefreshInFlight atomic.Bool
	panelRateLimitRefreshRetryAt  atomic.Int64
	panelRateLimitLastLogAt       atomic.Int64
	panelRateLimitRevision        atomic.Uint64

	// openAIQuotaAutoPauseSettingsCache holds the most recently observed quota auto-pause
	// settings. GetOpenAIQuotaAutoPauseSettings reads this atomic.Value on the request hot
	// path without ever blocking on the DB; when the cached entry expires, a background
	// goroutine refreshes it via openAIQuotaAutoPauseSettingsSF (stale-while-revalidate).
	// This per-service field also gives tests natural isolation — each SettingService
	// instance owns its own cache, no shared package-level state.
	openAIQuotaAutoPauseSettingsCache atomic.Value // *cachedOpenAIQuotaAutoPauseSettings
	openAIQuotaAutoPauseSettingsSF    singleflight.Group

	globalTempUnschedulableEnabled atomic.Bool
	globalTempUnschedulableLoaded  atomic.Int64
	globalTempUnschedulableSF      singleflight.Group

	streamModePerformanceEnabled atomic.Bool
	streamModePerformanceLoaded  atomic.Int64
	streamModePerformanceSF      singleflight.Group

	openAIWSModeRouterV2Enabled atomic.Bool
	openAIWSModeRouterV2Loaded  atomic.Int64
	openAIWSModeRouterV2SF      singleflight.Group

	streamResponseHeaderTimeoutDegradationEnabled atomic.Bool
	streamResponseHeaderTimeoutSeconds            atomic.Int64
	streamResponseHeaderTimeoutLoaded             atomic.Int64
	streamResponseHeaderTimeoutSF                 singleflight.Group

	thinkingDisplayModeCache    atomic.Value // string
	thinkingDisplayModeLoaded   atomic.Int64
	thinkingDisplayModeRevision atomic.Uint64
	thinkingDisplayModeSF       singleflight.Group

	requestPriorityAdmissionSettings     atomic.Pointer[RequestPriorityAdmissionSettings]
	requestPriorityAdmissionSinkMu       sync.RWMutex
	requestPriorityAdmissionSettingsSink func(RequestPriorityAdmissionSettings)
	requestPriorityAdmissionSyncMu       sync.Mutex
	requestPriorityAdmissionSync         *requestPriorityAdmissionSyncState
}

// NewSettingService 创建系统设置服务实例
func NewSettingService(settingRepo SettingRepository, cfg *config.Config) *SettingService {
	svc := &SettingService{
		settingRepo: settingRepo,
		cfg:         cfg,
	}
	// Preserve existing behavior until a persisted setting is loaded.
	svc.globalTempUnschedulableEnabled.Store(true)
	svc.streamResponseHeaderTimeoutDegradationEnabled.Store(true)
	svc.streamResponseHeaderTimeoutSeconds.Store(DefaultStreamResponseHeaderTimeoutSeconds)
	svc.thinkingDisplayModeCache.Store(ThinkingDisplayModeDisplayOnly)
	svc.requestPriorityAdmissionSettings.Store(defaultRequestPriorityAdmissionSettings())
	if cfg != nil {
		svc.openAIWSModeRouterV2Enabled.Store(cfg.Gateway.OpenAIWS.ModeRouterV2Enabled)
	}
	svc.openAIWSModeRouterV2Loaded.Store(time.Now().UnixNano())
	return svc
}

// SetProxyRepository injects a proxy repo for resolving websearch provider proxy URLs.
func (s *SettingService) SetProxyRepository(repo ProxyRepository) {
	s.proxyRepo = repo
}

func (s *SettingService) SetSchedulerEngineSwitcher(switcher SchedulerEngineSwitcher) {
	s.schedulerEngineSwitcher = switcher
}

func (s *SettingService) SetClientIPResolver(resolver *ip.Resolver) {
	s.clientIPResolver = resolver
}

// GetAllSettings 获取所有系统设置
func (s *SettingService) GetAllSettings(ctx context.Context) (*SystemSettings, error) {
	settings, err := s.settingRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("get all settings: %w", err)
	}

	result := s.parseSettings(settings)
	if s.clientIPResolver != nil {
		result.ClientIPResolutionStatus = s.clientIPResolver.Status()
	}
	if s.schedulerEngineSwitcher != nil {
		state := s.schedulerEngineSwitcher.SchedulerEngineState(ctx)
		result.SchedulerV2Enabled = state.V2Enabled()
		result.SchedulerV2Status = state.Status
		result.SchedulerV2Error = state.LastError
		if ValidateSchedulerV2Limits(state.CandidateLimit, state.ScanLimit) == nil {
			result.SchedulerV2CandidateLimit = state.CandidateLimit
			result.SchedulerV2ScanLimit = state.ScanLimit
		}
	}
	return result, nil
}

// SetOnUpdateCallback sets a callback function to be called when settings are updated
// This is used for cache invalidation (e.g., HTML cache in frontend server)
func (s *SettingService) SetOnUpdateCallback(callback func()) {
	s.onUpdate = callback
}

// SetVersion sets the application version for injection into public settings
func (s *SettingService) SetVersion(version string) {
	s.version = version
}

// getStringOrDefault 获取字符串值或默认值
func (s *SettingService) getStringOrDefault(settings map[string]string, key, defaultValue string) string {
	if value, ok := settings[key]; ok && value != "" {
		return value
	}
	return defaultValue
}
