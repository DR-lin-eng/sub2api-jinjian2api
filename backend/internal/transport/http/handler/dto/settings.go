package dto

import (
	"encoding/json"
	"strings"

	clientip "github.com/Wei-Shaw/sub2api/internal/shared/ip"
)

// CustomEndpoint represents an admin-configured API endpoint for quick copy.
type CustomEndpoint struct {
	Name        string `json:"name"`
	Endpoint    string `json:"endpoint"`
	Description string `json:"description"`
}

// SystemSettings represents the admin settings API response payload.
type SystemSettings struct {
	FrontendURL                 string   `json:"frontend_url"`
	TotpEnabled                 bool     `json:"totp_enabled"`                   // TOTP 双因素认证
	TotpEncryptionKeyConfigured bool     `json:"totp_encryption_key_configured"` // TOTP 加密密钥是否已配置
	PasskeyEnabled              bool     `json:"passkey_enabled"`
	PasskeyConfigured           bool     `json:"passkey_configured"`
	PasskeyRPID                 string   `json:"passkey_rp_id"`
	PasskeyRPOrigins            []string `json:"passkey_rp_origins"`
	SessionBindingEnabled       bool     `json:"session_binding_enabled"`  // 会话 IP/UA 绑定
	StepUpEnabled               bool     `json:"step_up_enabled"`          // 敏感操作 step-up 2FA
	AuditLogRetentionDays       int      `json:"audit_log_retention_days"` // 审计日志保留天数

	SMTPHost               string `json:"smtp_host"`
	SMTPPort               int    `json:"smtp_port"`
	SMTPUsername           string `json:"smtp_username"`
	SMTPPasswordConfigured bool   `json:"smtp_password_configured"`
	SMTPFrom               string `json:"smtp_from_email"`
	SMTPFromName           string `json:"smtp_from_name"`
	SMTPUseTLS             bool   `json:"smtp_use_tls"`

	APIKeyACLTrustForwardedIP bool                      `json:"api_key_acl_trust_forwarded_ip"`
	ClientIPResolutionMode    string                    `json:"client_ip_resolution_mode"`
	ClientIPTrustedProxies    []string                  `json:"client_ip_trusted_proxies"`
	ClientIPResolutionStatus  clientip.ResolutionStatus `json:"client_ip_resolution_status"`

	SiteName             string           `json:"site_name"`
	SiteLogo             string           `json:"site_logo"`
	APIBaseURL           string           `json:"api_base_url"`
	DocURL               string           `json:"doc_url"`
	HideCcsImportButton  bool             `json:"hide_ccs_import_button"`
	TableDefaultPageSize int              `json:"table_default_page_size"`
	TablePageSizeOptions []int            `json:"table_page_size_options"`
	CustomEndpoints      []CustomEndpoint `json:"custom_endpoints"`

	// Model fallback configuration
	EnableModelFallback      bool   `json:"enable_model_fallback"`
	FallbackModelAnthropic   string `json:"fallback_model_anthropic"`
	FallbackModelOpenAI      string `json:"fallback_model_openai"`
	FallbackModelGemini      string `json:"fallback_model_gemini"`
	FallbackModelAntigravity string `json:"fallback_model_antigravity"`

	// Identity patch configuration (Claude -> Gemini)
	EnableIdentityPatch bool   `json:"enable_identity_patch"`
	IdentityPatchPrompt string `json:"identity_patch_prompt"`

	// Ops monitoring (vNext)
	OpsMonitoringEnabled         bool   `json:"ops_monitoring_enabled"`
	OpsRealtimeMonitoringEnabled bool   `json:"ops_realtime_monitoring_enabled"`
	OpsQueryModeDefault          string `json:"ops_query_mode_default"`
	OpsMetricsIntervalSeconds    int    `json:"ops_metrics_interval_seconds"`

	MinClaudeCodeVersion string `json:"min_claude_code_version"`
	MaxClaudeCodeVersion string `json:"max_claude_code_version"`

	// 分组隔离
	AllowUngroupedKeyScheduling            bool   `json:"allow_ungrouped_key_scheduling"`
	SchedulerV2Enabled                     bool   `json:"scheduler_v2_enabled"`
	SchedulerV2Status                      string `json:"scheduler_v2_status"`
	SchedulerV2Error                       string `json:"scheduler_v2_error"`
	SchedulerV2CandidateLimit              int    `json:"scheduler_v2_candidate_limit"`
	SchedulerV2ScanLimit                   int    `json:"scheduler_v2_scan_limit"`
	RequestPriorityAdmissionEnabled        bool   `json:"request_priority_admission_enabled"`
	RequestPriorityPendingLimitPerInstance int    `json:"request_priority_pending_limit_per_instance"`
	RequestPriorityPendingMiBPerInstance   int    `json:"request_priority_pending_mib_per_instance"`

	// Performance settings
	StreamModePerformanceEnabled bool `json:"stream_mode_performance_enabled"`
	OpenAIWSModeRouterV2Enabled  bool `json:"openai_ws_mode_router_v2_enabled"`

	// Gateway forwarding behavior
	EnableFingerprintUnification           bool   `json:"enable_fingerprint_unification"`
	EnableMetadataPassthrough              bool   `json:"enable_metadata_passthrough"`
	EnableCCHSigning                       bool   `json:"enable_cch_signing"`
	EnableClaudeOAuthSystemPromptInjection bool   `json:"enable_claude_oauth_system_prompt_injection"`
	ClaudeOAuthSystemPrompt                string `json:"claude_oauth_system_prompt"`
	ClaudeOAuthSystemPromptBlocks          string `json:"claude_oauth_system_prompt_blocks"`
	EnableAnthropicCacheTTL1hInjection     bool   `json:"enable_anthropic_cache_ttl_1h_injection"`
	RewriteMessageCacheControl             bool   `json:"rewrite_message_cache_control"`
	EnableClientDatelineNormalization      bool   `json:"enable_client_dateline_normalization"`
	AntigravityUserAgentVersion            string `json:"antigravity_user_agent_version"`
	OpenAICodexUserAgent                   string `json:"openai_codex_user_agent"`
	OpenAICodexClientVersion               string `json:"openai_codex_client_version"`
	OpenAICodexClientVersionSynced         string `json:"openai_codex_client_version_synced"`
	OpenAICodexVersionAutoSyncEnabled      bool   `json:"openai_codex_version_auto_sync_enabled"`

	// codex_cli_only 加固
	MinCodexVersion                      string `json:"min_codex_version"`
	MaxCodexVersion                      string `json:"max_codex_version"`
	CodexCLIOnlyBlacklist                string `json:"codex_cli_only_blacklist"`
	CodexCLIOnlyWhitelist                string `json:"codex_cli_only_whitelist"`
	CodexCLIOnlyAllowAppServerClients    bool   `json:"codex_cli_only_allow_app_server_clients"`
	CodexCLIOnlyEngineFingerprintSignals string `json:"codex_cli_only_engine_fingerprint_signals"`

	// Web Search Emulation
	WebSearchEmulationEnabled bool `json:"web_search_emulation_enabled"`

	// OpenAI account scheduling
	OpenAILowUpstreamRatePriorityEnabled                   bool    `json:"openai_low_upstream_rate_priority_enabled"`
	OpenAIOAuthSchedulingRateMultiplier                    float64 `json:"openai_oauth_scheduling_rate_multiplier"`
	OpenAIContentSessionBurstBalanceEnabled                bool    `json:"openai_content_session_burst_balance_enabled"`
	OpenAIAdvancedSchedulerEnabled                         bool    `json:"openai_advanced_scheduler_enabled"`
	OpenAIAdvancedSchedulerStickyWeightedEnabled           bool    `json:"openai_advanced_scheduler_sticky_weighted_enabled"`
	OpenAIAdvancedSchedulerSubscriptionPriorityEnabled     bool    `json:"openai_advanced_scheduler_subscription_priority_enabled"`
	OpenAIAdvancedSchedulerLBTopK                          string  `json:"openai_advanced_scheduler_lb_top_k"`
	OpenAIAdvancedSchedulerWeightPriority                  string  `json:"openai_advanced_scheduler_weight_priority"`
	OpenAIAdvancedSchedulerWeightLoad                      string  `json:"openai_advanced_scheduler_weight_load"`
	OpenAIAdvancedSchedulerWeightQueue                     string  `json:"openai_advanced_scheduler_weight_queue"`
	OpenAIAdvancedSchedulerWeightErrorRate                 string  `json:"openai_advanced_scheduler_weight_error_rate"`
	OpenAIAdvancedSchedulerWeightTTFT                      string  `json:"openai_advanced_scheduler_weight_ttft"`
	OpenAIAdvancedSchedulerWeightReset                     string  `json:"openai_advanced_scheduler_weight_reset"`
	OpenAIAdvancedSchedulerWeightQuotaHeadroom             string  `json:"openai_advanced_scheduler_weight_quota_headroom"`
	OpenAIAdvancedSchedulerWeightUpstreamCost              string  `json:"openai_advanced_scheduler_weight_upstream_cost"`
	OpenAIAdvancedSchedulerWeightPreviousResponse          string  `json:"openai_advanced_scheduler_weight_previous_response"`
	OpenAIAdvancedSchedulerWeightSessionSticky             string  `json:"openai_advanced_scheduler_weight_session_sticky"`
	OpenAIAdvancedSchedulerEffectiveLBTopK                 string  `json:"openai_advanced_scheduler_effective_lb_top_k"`
	OpenAIAdvancedSchedulerEffectiveWeightPriority         string  `json:"openai_advanced_scheduler_effective_weight_priority"`
	OpenAIAdvancedSchedulerEffectiveWeightLoad             string  `json:"openai_advanced_scheduler_effective_weight_load"`
	OpenAIAdvancedSchedulerEffectiveWeightQueue            string  `json:"openai_advanced_scheduler_effective_weight_queue"`
	OpenAIAdvancedSchedulerEffectiveWeightErrorRate        string  `json:"openai_advanced_scheduler_effective_weight_error_rate"`
	OpenAIAdvancedSchedulerEffectiveWeightTTFT             string  `json:"openai_advanced_scheduler_effective_weight_ttft"`
	OpenAIAdvancedSchedulerEffectiveWeightReset            string  `json:"openai_advanced_scheduler_effective_weight_reset"`
	OpenAIAdvancedSchedulerEffectiveWeightQuotaHeadroom    string  `json:"openai_advanced_scheduler_effective_weight_quota_headroom"`
	OpenAIAdvancedSchedulerEffectiveWeightUpstreamCost     string  `json:"openai_advanced_scheduler_effective_weight_upstream_cost"`
	OpenAIAdvancedSchedulerEffectiveWeightPreviousResponse string  `json:"openai_advanced_scheduler_effective_weight_previous_response"`
	OpenAIAdvancedSchedulerEffectiveWeightSessionSticky    string  `json:"openai_advanced_scheduler_effective_weight_session_sticky"`

	// 上游账号限额通知
	AccountQuotaNotifyEnabled bool               `json:"account_quota_notify_enabled"`
	AccountQuotaNotifyEmails  []NotifyEmailEntry `json:"account_quota_notify_emails"`

	// Channel Monitor feature switch
	ChannelMonitorEnabled                bool `json:"channel_monitor_enabled"`
	ChannelMonitorDefaultIntervalSeconds int  `json:"channel_monitor_default_interval_seconds"`

	// 风控中心功能开关
	RiskControlEnabled bool `json:"risk_control_enabled"`

	// cyber 会话屏蔽开关 + TTL
	CyberSessionBlockEnabled    bool `json:"cyber_session_block_enabled"`
	CyberSessionBlockTTLSeconds int  `json:"cyber_session_block_ttl_seconds"`

	// OpenAI fast/flex policy
	OpenAIFastPolicySettings *OpenAIFastPolicySettings `json:"openai_fast_policy_settings,omitempty"`
}

type PublicSettings struct {
	TotpEnabled          bool             `json:"totp_enabled"` // TOTP 双因素认证
	PasskeyEnabled       bool             `json:"passkey_enabled"`
	SiteName             string           `json:"site_name"`
	SiteLogo             string           `json:"site_logo"`
	APIBaseURL           string           `json:"api_base_url"`
	DocURL               string           `json:"doc_url"`
	HideCcsImportButton  bool             `json:"hide_ccs_import_button"`
	TableDefaultPageSize int              `json:"table_default_page_size"`
	TablePageSizeOptions []int            `json:"table_page_size_options"`
	CustomEndpoints      []CustomEndpoint `json:"custom_endpoints"`
	Version              string           `json:"version"`
	// 服务器全局时区（IANA 名称与当前 UTC 偏移，如 "Asia/Shanghai" / "+08:00"）。
	// 高峰时段等按服务器本地时间判定的窗口，前端展示时据此标注，避免用户按浏览器本地时间误读。
	ServerTimezone                       string `json:"server_timezone"`
	ServerUTCOffset                      string `json:"server_utc_offset"`
	ChannelMonitorEnabled                bool   `json:"channel_monitor_enabled"`
	ChannelMonitorDefaultIntervalSeconds int    `json:"channel_monitor_default_interval_seconds"`
}

// OverloadCooldownSettings 529过载冷却配置 DTO
type OverloadCooldownSettings struct {
	Enabled         bool `json:"enabled"`
	CooldownMinutes int  `json:"cooldown_minutes"`
}

// RateLimit429CooldownSettings 429默认回避配置 DTO
type RateLimit429CooldownSettings struct {
	Enabled         bool `json:"enabled"`
	CooldownSeconds int  `json:"cooldown_seconds"`
}

// GlobalTempUnschedulableSettings 全局临时不可调度配置 DTO
type GlobalTempUnschedulableSettings struct {
	Enabled bool `json:"enabled"`
}

// PanelRateLimitSettings 面板 API 限流配置 DTO
type PanelRateLimitSettings struct {
	Enabled     bool `json:"enabled"`
	UserRPM     int  `json:"user_rpm"`
	HeavyRPM    int  `json:"heavy_rpm"`
	ExemptAdmin bool `json:"exempt_admin"`
	PublicIPRPM int  `json:"public_ip_rpm"`
}

// StreamTimeoutSettings 流超时处理配置 DTO
type StreamTimeoutSettings struct {
	ResponseHeaderTimeoutDegradationEnabled bool   `json:"response_header_timeout_degradation_enabled"`
	ResponseHeaderTimeoutSeconds            int    `json:"response_header_timeout_seconds"`
	Enabled                                 bool   `json:"enabled"`
	Action                                  string `json:"action"`
	TempUnschedMinutes                      int    `json:"temp_unsched_minutes"`
	ThresholdCount                          int    `json:"threshold_count"`
	ThresholdWindowMinutes                  int    `json:"threshold_window_minutes"`
}

// RectifierSettings 请求整流器配置 DTO
type RectifierSettings struct {
	Enabled                  bool     `json:"enabled"`
	ThinkingSignatureEnabled bool     `json:"thinking_signature_enabled"`
	ThinkingBudgetEnabled    bool     `json:"thinking_budget_enabled"`
	ThinkingDisplayMode      string   `json:"thinking_display_mode"`
	APIKeySignatureEnabled   bool     `json:"apikey_signature_enabled"`
	APIKeySignaturePatterns  []string `json:"apikey_signature_patterns"`
}

// BetaPolicyRule Beta 策略规则 DTO
type BetaPolicyRule struct {
	BetaToken            string   `json:"beta_token"`
	Action               string   `json:"action"`
	Scope                string   `json:"scope"`
	ErrorMessage         string   `json:"error_message,omitempty"`
	ModelWhitelist       []string `json:"model_whitelist,omitempty"`
	FallbackAction       string   `json:"fallback_action,omitempty"`
	FallbackErrorMessage string   `json:"fallback_error_message,omitempty"`
}

// BetaPolicySettings Beta 策略配置 DTO
type BetaPolicySettings struct {
	Rules []BetaPolicyRule `json:"rules"`
}

// OpenAIFastPolicyRule OpenAI fast/flex 策略规则 DTO
type OpenAIFastPolicyRule struct {
	ServiceTier          string   `json:"service_tier"`
	Action               string   `json:"action"`
	Scope                string   `json:"scope"`
	ErrorMessage         string   `json:"error_message,omitempty"`
	ModelWhitelist       []string `json:"model_whitelist,omitempty"`
	FallbackAction       string   `json:"fallback_action,omitempty"`
	FallbackErrorMessage string   `json:"fallback_error_message,omitempty"`
}

// OpenAIFastPolicySettings OpenAI fast 策略配置 DTO
type OpenAIFastPolicySettings struct {
	Rules []OpenAIFastPolicyRule `json:"rules"`
}

// EmailTemplateEventOption 描述可编辑的通知邮件事件。
type EmailTemplateEventOption struct {
	Value       string `json:"value"`
	Label       string `json:"label,omitempty"`
	Description string `json:"description,omitempty"`
	Category    string `json:"category,omitempty"`
}

// EmailTemplateSummary is shown in the admin email template list.
type EmailTemplateSummary struct {
	Event     string `json:"event"`
	Locale    string `json:"locale"`
	Subject   string `json:"subject"`
	IsCustom  bool   `json:"is_custom,omitempty"`
	UpdatedAt string `json:"updated_at,omitempty"`
}

// EmailTemplateListResponse is returned by GET /admin/settings/email-templates.
type EmailTemplateListResponse struct {
	Events       []EmailTemplateEventOption `json:"events"`
	Locales      []string                   `json:"locales"`
	Templates    []EmailTemplateSummary     `json:"templates,omitempty"`
	Placeholders []string                   `json:"placeholders,omitempty"`
}

// EmailTemplateDetail is returned for a specific event/locale template.
type EmailTemplateDetail struct {
	Event        string   `json:"event"`
	Locale       string   `json:"locale"`
	Subject      string   `json:"subject"`
	HTML         string   `json:"html"`
	IsCustom     bool     `json:"is_custom,omitempty"`
	UpdatedAt    string   `json:"updated_at,omitempty"`
	Placeholders []string `json:"placeholders,omitempty"`
}

// UpdateEmailTemplateRequest updates a template override.
type UpdateEmailTemplateRequest struct {
	Subject string `json:"subject"`
	HTML    string `json:"html"`
}

// PreviewEmailTemplateRequest previews a template without saving it.
type PreviewEmailTemplateRequest struct {
	Event     string            `json:"event"`
	Locale    string            `json:"locale"`
	Subject   string            `json:"subject"`
	HTML      string            `json:"html"`
	Variables map[string]string `json:"variables,omitempty"`
}

// EmailTemplatePreviewResponse is the rendered preview payload.
type EmailTemplatePreviewResponse struct {
	Subject string `json:"subject"`
	HTML    string `json:"html"`
}

// ParseCustomEndpoints parses a JSON string into a slice of CustomEndpoint.
// Returns empty slice on empty/invalid input.
func ParseCustomEndpoints(raw string) []CustomEndpoint {
	raw = strings.TrimSpace(raw)
	if raw == "" || raw == "[]" {
		return []CustomEndpoint{}
	}
	var items []CustomEndpoint
	if err := json.Unmarshal([]byte(raw), &items); err != nil {
		return []CustomEndpoint{}
	}
	return items
}
