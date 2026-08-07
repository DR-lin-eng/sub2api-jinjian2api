package admin

import "github.com/Wei-Shaw/sub2api/internal/transport/http/handler/dto"

// UpdateSettingsRequest 更新设置请求
type UpdateSettingsRequest struct {
	FrontendURL           string `json:"frontend_url"`
	TotpEnabled           bool   `json:"totp_enabled"`             // TOTP 双因素认证
	PasskeyEnabled        *bool  `json:"passkey_enabled"`          // Passkey 登录（省略=保持现值）
	SessionBindingEnabled *bool  `json:"session_binding_enabled"`  // 会话 IP/UA 绑定（省略=保持现值）
	StepUpEnabled         *bool  `json:"step_up_enabled"`          // 敏感操作 step-up 2FA（省略=保持现值）
	AuditLogRetentionDays int    `json:"audit_log_retention_days"` // 审计日志保留天数

	// 邮件服务设置
	SMTPHost     string `json:"smtp_host"`
	SMTPPort     int    `json:"smtp_port"`
	SMTPUsername string `json:"smtp_username"`
	SMTPPassword string `json:"smtp_password"`
	SMTPFrom     string `json:"smtp_from_email"`
	SMTPFromName string `json:"smtp_from_name"`
	SMTPUseTLS   bool   `json:"smtp_use_tls"`

	// API Key IP 访问控制设置
	APIKeyACLTrustForwardedIP *bool     `json:"api_key_acl_trust_forwarded_ip"`
	ClientIPResolutionMode    *string   `json:"client_ip_resolution_mode"`
	ClientIPTrustedProxies    *[]string `json:"client_ip_trusted_proxies"`

	// OEM设置
	SiteName             string                `json:"site_name"`
	SiteLogo             string                `json:"site_logo"`
	APIBaseURL           string                `json:"api_base_url"`
	DocURL               string                `json:"doc_url"`
	HideCcsImportButton  bool                  `json:"hide_ccs_import_button"`
	TableDefaultPageSize int                   `json:"table_default_page_size"`
	TablePageSizeOptions []int                 `json:"table_page_size_options"`
	CustomEndpoints      *[]dto.CustomEndpoint `json:"custom_endpoints"`

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
	OpsMonitoringEnabled         *bool   `json:"ops_monitoring_enabled"`
	OpsRealtimeMonitoringEnabled *bool   `json:"ops_realtime_monitoring_enabled"`
	OpsQueryModeDefault          *string `json:"ops_query_mode_default"`
	OpsMetricsIntervalSeconds    *int    `json:"ops_metrics_interval_seconds"`

	MinClaudeCodeVersion string `json:"min_claude_code_version"`
	MaxClaudeCodeVersion string `json:"max_claude_code_version"`

	// 分组隔离
	AllowUngroupedKeyScheduling            bool  `json:"allow_ungrouped_key_scheduling"`
	SchedulerV2Enabled                     *bool `json:"scheduler_v2_enabled"`
	SchedulerV2CandidateLimit              *int  `json:"scheduler_v2_candidate_limit"`
	SchedulerV2ScanLimit                   *int  `json:"scheduler_v2_scan_limit"`
	RequestPriorityAdmissionEnabled        *bool `json:"request_priority_admission_enabled"`
	RequestPriorityPendingLimitPerInstance *int  `json:"request_priority_pending_limit_per_instance"`
	RequestPriorityPendingMiBPerInstance   *int  `json:"request_priority_pending_mib_per_instance"`

	// Performance settings
	StreamModePerformanceEnabled *bool `json:"stream_mode_performance_enabled"`
	OpenAIWSModeRouterV2Enabled  *bool `json:"openai_ws_mode_router_v2_enabled"`

	// Gateway forwarding behavior
	EnableFingerprintUnification           *bool   `json:"enable_fingerprint_unification"`
	EnableMetadataPassthrough              *bool   `json:"enable_metadata_passthrough"`
	EnableCCHSigning                       *bool   `json:"enable_cch_signing"`
	EnableClaudeOAuthSystemPromptInjection *bool   `json:"enable_claude_oauth_system_prompt_injection"`
	ClaudeOAuthSystemPrompt                *string `json:"claude_oauth_system_prompt"`
	ClaudeOAuthSystemPromptBlocks          *string `json:"claude_oauth_system_prompt_blocks"`
	EnableAnthropicCacheTTL1hInjection     *bool   `json:"enable_anthropic_cache_ttl_1h_injection"`
	RewriteMessageCacheControl             *bool   `json:"rewrite_message_cache_control"`
	EnableClientDatelineNormalization      *bool   `json:"enable_client_dateline_normalization"`
	AntigravityUserAgentVersion            *string `json:"antigravity_user_agent_version"`
	OpenAICodexUserAgent                   *string `json:"openai_codex_user_agent"`
	OpenAICodexClientVersion               *string `json:"openai_codex_client_version"`
	OpenAICodexVersionAutoSyncEnabled      *bool   `json:"openai_codex_version_auto_sync_enabled"`

	// codex_cli_only 加固（global-only）
	MinCodexVersion                      string `json:"min_codex_version"`
	MaxCodexVersion                      string `json:"max_codex_version"`
	CodexCLIOnlyBlacklist                string `json:"codex_cli_only_blacklist"`
	CodexCLIOnlyWhitelist                string `json:"codex_cli_only_whitelist"`
	CodexCLIOnlyAllowAppServerClients    *bool  `json:"codex_cli_only_allow_app_server_clients"`
	CodexCLIOnlyEngineFingerprintSignals string `json:"codex_cli_only_engine_fingerprint_signals"`

	// OpenAI account scheduling
	OpenAILowUpstreamRatePriorityEnabled               *bool    `json:"openai_low_upstream_rate_priority_enabled"`
	OpenAIOAuthSchedulingRateMultiplier                *float64 `json:"openai_oauth_scheduling_rate_multiplier"`
	OpenAIContentSessionBurstBalanceEnabled            *bool    `json:"openai_content_session_burst_balance_enabled"`
	OpenAIAdvancedSchedulerEnabled                     *bool    `json:"openai_advanced_scheduler_enabled"`
	OpenAIAdvancedSchedulerStickyWeightedEnabled       *bool    `json:"openai_advanced_scheduler_sticky_weighted_enabled"`
	OpenAIAdvancedSchedulerSubscriptionPriorityEnabled *bool    `json:"openai_advanced_scheduler_subscription_priority_enabled"`
	OpenAIAdvancedSchedulerLBTopK                      *string  `json:"openai_advanced_scheduler_lb_top_k"`
	OpenAIAdvancedSchedulerWeightPriority              *string  `json:"openai_advanced_scheduler_weight_priority"`
	OpenAIAdvancedSchedulerWeightLoad                  *string  `json:"openai_advanced_scheduler_weight_load"`
	OpenAIAdvancedSchedulerWeightQueue                 *string  `json:"openai_advanced_scheduler_weight_queue"`
	OpenAIAdvancedSchedulerWeightErrorRate             *string  `json:"openai_advanced_scheduler_weight_error_rate"`
	OpenAIAdvancedSchedulerWeightTTFT                  *string  `json:"openai_advanced_scheduler_weight_ttft"`
	OpenAIAdvancedSchedulerWeightReset                 *string  `json:"openai_advanced_scheduler_weight_reset"`
	OpenAIAdvancedSchedulerWeightQuotaHeadroom         *string  `json:"openai_advanced_scheduler_weight_quota_headroom"`
	OpenAIAdvancedSchedulerWeightUpstreamCost          *string  `json:"openai_advanced_scheduler_weight_upstream_cost"`
	OpenAIAdvancedSchedulerWeightPreviousResponse      *string  `json:"openai_advanced_scheduler_weight_previous_response"`
	OpenAIAdvancedSchedulerWeightSessionSticky         *string  `json:"openai_advanced_scheduler_weight_session_sticky"`

	AccountQuotaNotifyEnabled *bool                   `json:"account_quota_notify_enabled"`
	AccountQuotaNotifyEmails  *[]dto.NotifyEmailEntry `json:"account_quota_notify_emails"`

	// Channel Monitor feature switch
	ChannelMonitorEnabled                *bool `json:"channel_monitor_enabled"`
	ChannelMonitorDefaultIntervalSeconds *int  `json:"channel_monitor_default_interval_seconds"`

	// 风控中心功能开关
	RiskControlEnabled *bool `json:"risk_control_enabled"`

	// cyber 会话屏蔽开关 + TTL
	CyberSessionBlockEnabled    *bool `json:"cyber_session_block_enabled"`
	CyberSessionBlockTTLSeconds *int  `json:"cyber_session_block_ttl_seconds"`

	// OpenAI fast/flex policy (optional, only updated when provided)
	OpenAIFastPolicySettings *dto.OpenAIFastPolicySettings `json:"openai_fast_policy_settings,omitempty"`
}
