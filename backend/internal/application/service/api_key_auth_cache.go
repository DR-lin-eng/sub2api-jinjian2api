package service

import (
	"sync"
	"sync/atomic"
	"time"
)

// APIKeyAuthSnapshot API Key 认证缓存快照（仅包含认证所需字段）
type APIKeyAuthSnapshot struct {
	Version     int                      `json:"version"`
	APIKeyID    int64                    `json:"api_key_id"`
	UserID      int64                    `json:"user_id"`
	GroupID     *int64                   `json:"group_id,omitempty"`
	Name        string                   `json:"name"`
	Status      string                   `json:"status"`
	IPWhitelist []string                 `json:"ip_whitelist,omitempty"`
	IPBlacklist []string                 `json:"ip_blacklist,omitempty"`
	User        APIKeyAuthUserSnapshot   `json:"user"`
	Group       *APIKeyAuthGroupSnapshot `json:"group,omitempty"`

	// Expiration field for API Key expiration feature
	ExpiresAt *time.Time `json:"expires_at,omitempty"` // Expiration time (nil = never expires)

	// Maximum concurrent requests for this API key (0 = unlimited).
	ConcurrencyLimit int `json:"concurrency_limit"`
}

// APIKeyAuthUserSnapshot 用户快照
type APIKeyAuthUserSnapshot struct {
	ID             int64                 `json:"id"`
	Status         string                `json:"status"`
	Role           string                `json:"role"`
	Concurrency    int                   `json:"concurrency"`
	SchedulingTier RequestSchedulingTier `json:"scheduling_tier"`
	Email          string                `json:"email"`
	Username       string                `json:"username"`
}

// APIKeyAuthGroupSnapshot 分组快照
type APIKeyAuthGroupSnapshot struct {
	ID                              int64    `json:"id"`
	Name                            string   `json:"name"`
	Platform                        string   `json:"platform"`
	Status                          string   `json:"status"`
	RateMultiplier                  float64  `json:"rate_multiplier"`
	AllowImageGeneration            bool     `json:"allow_image_generation"`
	OpenAIForceImageTool            bool     `json:"openai_force_image_tool"`
	ImageRateIndependent            bool     `json:"image_rate_independent"`
	ImageRateMultiplier             float64  `json:"image_rate_multiplier"`
	ImagePrice1K                    *float64 `json:"image_price_1k,omitempty"`
	ImagePrice2K                    *float64 `json:"image_price_2k,omitempty"`
	ImagePrice4K                    *float64 `json:"image_price_4k,omitempty"`
	VideoRateIndependent            bool     `json:"video_rate_independent"`
	VideoRateMultiplier             float64  `json:"video_rate_multiplier"`
	VideoPrice480P                  *float64 `json:"video_price_480p,omitempty"`
	VideoPrice720P                  *float64 `json:"video_price_720p,omitempty"`
	VideoPrice1080P                 *float64 `json:"video_price_1080p,omitempty"`
	WebSearchPricePerCall           *float64 `json:"web_search_price_per_call,omitempty"`
	ClaudeCodeOnly                  bool     `json:"claude_code_only"`
	FallbackGroupID                 *int64   `json:"fallback_group_id,omitempty"`
	FallbackGroupIDOnInvalidRequest *int64   `json:"fallback_group_id_on_invalid_request,omitempty"`

	// Model routing is used by gateway account selection, so it must be part of auth cache snapshot.
	// Only anthropic groups use these fields; others may leave them empty.
	ModelRouting        map[string][]int64 `json:"model_routing,omitempty"`
	ModelRoutingEnabled bool               `json:"model_routing_enabled"`
	MCPXMLInject        bool               `json:"mcp_xml_inject"`

	// 支持的模型系列（仅 antigravity 平台使用）
	SupportedModelScopes []string `json:"supported_model_scopes,omitempty"`

	// OpenAI Messages 调度配置（仅 openai 平台使用）
	AllowMessagesDispatch       bool                              `json:"allow_messages_dispatch"`
	AllowLive                   bool                              `json:"allow_live"`
	DefaultMappedModel          string                            `json:"default_mapped_model,omitempty"`
	MessagesDispatchModelConfig OpenAIMessagesDispatchModelConfig `json:"messages_dispatch_model_config,omitempty"`
	ModelsListConfig            GroupModelsListConfig             `json:"models_list_config,omitempty"`

	// MaxReasoningEffort OpenAI/Codex 请求的推理强度上限，空字符串表示不限制。
	MaxReasoningEffort string `json:"max_reasoning_effort,omitempty"`
	// ReasoningEffortMappings rewrites explicit effort values before the ceiling.
	ReasoningEffortMappings []ReasoningEffortMapping `json:"reasoning_effort_mappings"`

	ProfitControlEnabled bool    `json:"profit_control_enabled"`
	ProfitMinMargin      float64 `json:"profit_min_margin"`
	ProfitSafetyBuffer   float64 `json:"profit_safety_buffer"`
}

// APIKeyAuthCacheEntry 缓存条目，支持负缓存
type APIKeyAuthCacheEntry struct {
	NotFound bool                `json:"not_found"`
	Snapshot *APIKeyAuthSnapshot `json:"snapshot,omitempty"`

	runtimeMu     sync.Mutex
	runtimeAPIKey atomic.Pointer[APIKey]
}
