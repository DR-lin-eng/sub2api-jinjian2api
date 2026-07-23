import type {
  SystemSettings,
  DefaultSubscriptionSetting,
  DefaultPlatformQuotasMap,
  ClientIpResolutionStatus,
  OpenAIFastPolicySettings,
} from '@/features/admin-settings/domain/models/adminSettings'
import type { CustomEndpoint, CustomMenuItem } from '@/types'
import type { LoginAgreementDocument, NotifyEmailEntry } from '@/features/auth/domain/models/auth'
// The DTO mirrors the raw backend snake_case response exactly.
// toEntity() converts it to the camelCase Entity consumed by the presentation layer.

export interface ClientIpResolutionStatusDto {
  mode: string
  custom_prefix_count: number
  static_prefix_count: number
  cloudflare_prefix_count: number
  cloudflare_ranges_source: 'embedded' | 'refreshed'
  cloudflare_last_success_at: string | null
}

export interface SystemSettingsDto {
  registration_enabled: boolean
  email_verify_enabled: boolean
  registration_email_suffix_whitelist: string[]
  promo_code_enabled: boolean
  password_reset_enabled: boolean
  frontend_url: string
  invitation_code_enabled: boolean
  totp_enabled: boolean
  totp_encryption_key_configured: boolean
  session_binding_enabled: boolean
  step_up_enabled: boolean
  audit_log_retention_days: number
  login_agreement_enabled: boolean
  login_agreement_mode: 'modal' | 'checkbox' | string
  login_agreement_updated_at: string
  login_agreement_documents: LoginAgreementDocument[]
  default_balance: number
  affiliate_rebate_rate: number
  affiliate_rebate_freeze_hours: number
  affiliate_rebate_duration_days: number
  affiliate_rebate_per_invitee_cap: number
  affiliate_admin_recharge_enabled: boolean
  default_concurrency: number
  default_user_rpm_limit: number
  default_subscriptions: DefaultSubscriptionSetting[]
  default_platform_quotas?: DefaultPlatformQuotasMap
  site_name: string
  site_logo: string
  site_subtitle: string
  api_base_url: string
  contact_info: string
  doc_url: string
  home_content: string
  hide_ccs_import_button: boolean
  table_default_page_size: number
  table_page_size_options: number[]
  backend_mode_enabled: boolean
  stream_mode_performance_enabled: boolean
  custom_menu_items: CustomMenuItem[]
  custom_endpoints: CustomEndpoint[]
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password_configured: boolean
  smtp_from_email: string
  smtp_from_name: string
  smtp_use_tls: boolean
  turnstile_enabled: boolean
  turnstile_site_key: string
  turnstile_secret_key_configured: boolean
  recaptcha_enabled: boolean
  recaptcha_site_key: string
  recaptcha_secret_key_configured: boolean
  cap_enabled: boolean
  cap_api_endpoint: string
  cap_secret_key_configured: boolean
  local_captcha_enabled: boolean
  api_key_acl_trust_forwarded_ip: boolean
  client_ip_resolution_mode: string
  client_ip_trusted_proxies: string[]
  client_ip_resolution_status: ClientIpResolutionStatusDto
  linuxdo_connect_enabled: boolean
  linuxdo_connect_client_id: string
  linuxdo_connect_client_secret_configured: boolean
  linuxdo_connect_redirect_url: string
  dingtalk_connect_enabled: boolean
  dingtalk_connect_client_id: string
  dingtalk_connect_client_secret_configured: boolean
  dingtalk_connect_redirect_url: string
  dingtalk_connect_corp_restriction_policy: string
  dingtalk_connect_internal_corp_id: string
  dingtalk_connect_bypass_registration: boolean
  dingtalk_connect_sync_corp_email: boolean
  dingtalk_connect_sync_display_name: boolean
  dingtalk_connect_sync_dept: boolean
  dingtalk_connect_sync_corp_email_attr_key: string
  dingtalk_connect_sync_display_name_attr_key: string
  dingtalk_connect_sync_dept_attr_key: string
  dingtalk_connect_sync_corp_email_attr_name: string
  dingtalk_connect_sync_display_name_attr_name: string
  dingtalk_connect_sync_dept_attr_name: string
  wechat_connect_enabled: boolean
  wechat_connect_app_id: string
  wechat_connect_app_secret_configured: boolean
  wechat_connect_open_app_id?: string
  wechat_connect_open_app_secret_configured?: boolean
  wechat_connect_mp_app_id?: string
  wechat_connect_mp_app_secret_configured?: boolean
  wechat_connect_mobile_app_id?: string
  wechat_connect_mobile_app_secret_configured?: boolean
  wechat_connect_open_enabled?: boolean
  wechat_connect_mp_enabled?: boolean
  wechat_connect_mobile_enabled?: boolean
  wechat_connect_mode: string
  wechat_connect_scopes: string
  wechat_connect_redirect_url: string
  wechat_connect_frontend_redirect_url: string
  oidc_connect_enabled: boolean
  oidc_connect_provider_name: string
  oidc_connect_client_id: string
  oidc_connect_client_secret_configured: boolean
  oidc_connect_issuer_url: string
  oidc_connect_discovery_url: string
  oidc_connect_authorize_url: string
  oidc_connect_token_url: string
  oidc_connect_userinfo_url: string
  oidc_connect_jwks_url: string
  oidc_connect_scopes: string
  oidc_connect_redirect_url: string
  oidc_connect_frontend_redirect_url: string
  oidc_connect_token_auth_method: string
  oidc_connect_use_pkce: boolean
  oidc_connect_validate_id_token: boolean
  oidc_connect_allowed_signing_algs: string
  oidc_connect_clock_skew_seconds: number
  oidc_connect_require_email_verified: boolean
  oidc_connect_userinfo_email_path: string
  oidc_connect_userinfo_id_path: string
  oidc_connect_userinfo_username_path: string
  github_oauth_enabled: boolean
  github_oauth_client_id: string
  github_oauth_client_secret_configured: boolean
  github_oauth_redirect_url: string
  github_oauth_frontend_redirect_url: string
  google_oauth_enabled: boolean
  google_oauth_client_id: string
  google_oauth_client_secret_configured: boolean
  google_oauth_redirect_url: string
  google_oauth_frontend_redirect_url: string
  enable_model_fallback: boolean
  fallback_model_anthropic: string
  fallback_model_openai: string
  fallback_model_gemini: string
  fallback_model_antigravity: string
  enable_identity_patch: boolean
  identity_patch_prompt: string
  ops_monitoring_enabled: boolean
  ops_realtime_monitoring_enabled: boolean
  ops_query_mode_default: 'auto' | 'raw' | 'preagg' | string
  ops_metrics_interval_seconds: number
  min_claude_code_version: string
  max_claude_code_version: string
  allow_ungrouped_key_scheduling: boolean
  scheduler_v2_enabled: boolean
  scheduler_v2_status: string
  scheduler_v2_error: string
  scheduler_v2_candidate_limit: number
  scheduler_v2_scan_limit: number
  enable_fingerprint_unification: boolean
  enable_metadata_passthrough: boolean
  enable_cch_signing: boolean
  enable_claude_oauth_system_prompt_injection: boolean
  claude_oauth_system_prompt: string
  claude_oauth_system_prompt_blocks: string
  enable_anthropic_cache_ttl_1h_injection: boolean
  rewrite_message_cache_control: boolean
  enable_client_dateline_normalization: boolean
  antigravity_user_agent_version: string
  openai_codex_user_agent: string
  min_codex_version: string
  max_codex_version: string
  codex_cli_only_blacklist: string
  codex_cli_only_whitelist: string
  codex_cli_only_allow_app_server_clients: boolean
  codex_cli_only_engine_fingerprint_signals: string
  web_search_emulation_enabled?: boolean
  payment_enabled: boolean
  risk_control_enabled: boolean
  cyber_session_block_enabled: boolean
  cyber_session_block_ttl_seconds: number
  payment_min_amount: number
  payment_max_amount: number
  payment_daily_limit: number
  payment_order_timeout_minutes: number
  payment_max_pending_orders: number
  payment_enabled_types: string[]
  payment_balance_disabled: boolean
  payment_balance_recharge_multiplier: number
  payment_subscription_usd_to_cny_rate: number
  payment_recharge_fee_rate: number
  payment_load_balance_strategy: string
  payment_product_name_prefix: string
  payment_product_name_suffix: string
  payment_help_image_url: string
  payment_help_text: string
  payment_cancel_rate_limit_enabled: boolean
  payment_cancel_rate_limit_max: number
  payment_cancel_rate_limit_window: number
  payment_cancel_rate_limit_unit: string
  payment_cancel_rate_limit_window_mode: string
  payment_alipay_force_qrcode?: boolean
  payment_visible_method_alipay_source?: string
  payment_visible_method_wxpay_source?: string
  payment_visible_method_alipay_enabled?: boolean
  payment_visible_method_wxpay_enabled?: boolean
  openai_low_upstream_rate_priority_enabled?: boolean
  openai_oauth_scheduling_rate_multiplier?: number
  openai_advanced_scheduler_enabled?: boolean
  openai_advanced_scheduler_sticky_weighted_enabled?: boolean
  openai_advanced_scheduler_subscription_priority_enabled?: boolean
  openai_advanced_scheduler_lb_top_k?: string
  openai_advanced_scheduler_weight_priority?: string
  openai_advanced_scheduler_weight_load?: string
  openai_advanced_scheduler_weight_queue?: string
  openai_advanced_scheduler_weight_error_rate?: string
  openai_advanced_scheduler_weight_ttft?: string
  openai_advanced_scheduler_weight_reset?: string
  openai_advanced_scheduler_weight_quota_headroom?: string
  openai_advanced_scheduler_weight_upstream_cost?: string
  openai_advanced_scheduler_weight_previous_response?: string
  openai_advanced_scheduler_weight_session_sticky?: string
  openai_advanced_scheduler_effective_lb_top_k?: string
  openai_advanced_scheduler_effective_weight_priority?: string
  openai_advanced_scheduler_effective_weight_load?: string
  openai_advanced_scheduler_effective_weight_queue?: string
  openai_advanced_scheduler_effective_weight_error_rate?: string
  openai_advanced_scheduler_effective_weight_ttft?: string
  openai_advanced_scheduler_effective_weight_reset?: string
  openai_advanced_scheduler_effective_weight_quota_headroom?: string
  openai_advanced_scheduler_effective_weight_upstream_cost?: string
  openai_advanced_scheduler_effective_weight_previous_response?: string
  openai_advanced_scheduler_effective_weight_session_sticky?: string
  balance_low_notify_enabled: boolean
  balance_low_notify_threshold: number
  balance_low_notify_recharge_url: string
  subscription_expiry_notify_enabled: boolean
  account_quota_notify_enabled: boolean
  account_quota_notify_emails: NotifyEmailEntry[]
  channel_monitor_enabled: boolean
  channel_monitor_default_interval_seconds: number
  available_channels_enabled: boolean
  affiliate_enabled: boolean
  openai_fast_policy_settings?: OpenAIFastPolicySettings
  allow_user_view_error_requests: boolean
  allow_user_view_usage_details: boolean
}

function toClientIpResolutionStatus(dto: ClientIpResolutionStatusDto): ClientIpResolutionStatus {
  return {
    mode: (dto.mode ?? 'auto_compat') as ClientIpResolutionStatus['mode'],
    customPrefixCount: dto.custom_prefix_count ?? 0,
    staticPrefixCount: dto.static_prefix_count ?? 0,
    cloudflarePrefixCount: dto.cloudflare_prefix_count ?? 0,
    cloudflareRangesSource: dto.cloudflare_ranges_source ?? 'embedded',
    cloudflareLastSuccessAt: dto.cloudflare_last_success_at ?? null,
  }
}

export function toEntity(dto: SystemSettingsDto): SystemSettings {
  return {
    registrationEnabled: dto.registration_enabled ?? false,
    emailVerifyEnabled: dto.email_verify_enabled ?? false,
    registrationEmailSuffixWhitelist: dto.registration_email_suffix_whitelist ?? [],
    promoCodeEnabled: dto.promo_code_enabled ?? false,
    passwordResetEnabled: dto.password_reset_enabled ?? false,
    frontendUrl: dto.frontend_url ?? '',
    invitationCodeEnabled: dto.invitation_code_enabled ?? false,
    totpEnabled: dto.totp_enabled ?? false,
    totpEncryptionKeyConfigured: dto.totp_encryption_key_configured ?? false,
    sessionBindingEnabled: dto.session_binding_enabled ?? false,
    stepUpEnabled: dto.step_up_enabled ?? false,
    auditLogRetentionDays: dto.audit_log_retention_days ?? 90,
    loginAgreementEnabled: dto.login_agreement_enabled ?? false,
    loginAgreementMode: dto.login_agreement_mode ?? 'modal',
    loginAgreementUpdatedAt: dto.login_agreement_updated_at ?? '',
    loginAgreementDocuments: dto.login_agreement_documents ?? [],
    defaultBalance: dto.default_balance ?? 0,
    affiliateRebateRate: dto.affiliate_rebate_rate ?? 0,
    affiliateRebateFreezeHours: dto.affiliate_rebate_freeze_hours ?? 0,
    affiliateRebateDurationDays: dto.affiliate_rebate_duration_days ?? 0,
    affiliateRebatePerInviteeCap: dto.affiliate_rebate_per_invitee_cap ?? 0,
    affiliateAdminRechargeEnabled: dto.affiliate_admin_recharge_enabled ?? false,
    defaultConcurrency: dto.default_concurrency ?? 5,
    defaultUserRpmLimit: dto.default_user_rpm_limit ?? 0,
    defaultSubscriptions: dto.default_subscriptions ?? [],
    defaultPlatformQuotas: dto.default_platform_quotas,
    siteName: dto.site_name ?? '',
    siteLogo: dto.site_logo ?? '',
    siteSubtitle: dto.site_subtitle ?? '',
    apiBaseUrl: dto.api_base_url ?? '',
    contactInfo: dto.contact_info ?? '',
    docUrl: dto.doc_url ?? '',
    homeContent: dto.home_content ?? '',
    hideCcsImportButton: dto.hide_ccs_import_button ?? false,
    tableDefaultPageSize: dto.table_default_page_size ?? 20,
    tablePageSizeOptions: dto.table_page_size_options ?? [],
    backendModeEnabled: dto.backend_mode_enabled ?? false,
    streamModePerformanceEnabled: dto.stream_mode_performance_enabled ?? false,
    customMenuItems: dto.custom_menu_items ?? [],
    customEndpoints: dto.custom_endpoints ?? [],
    smtpHost: dto.smtp_host ?? '',
    smtpPort: dto.smtp_port ?? 25,
    smtpUsername: dto.smtp_username ?? '',
    smtpPasswordConfigured: dto.smtp_password_configured ?? false,
    smtpFromEmail: dto.smtp_from_email ?? '',
    smtpFromName: dto.smtp_from_name ?? '',
    smtpUseTls: dto.smtp_use_tls ?? false,
    turnstileEnabled: dto.turnstile_enabled ?? false,
    turnstileSiteKey: dto.turnstile_site_key ?? '',
    turnstileSecretKeyConfigured: dto.turnstile_secret_key_configured ?? false,
    recaptchaEnabled: dto.recaptcha_enabled ?? false,
    recaptchaSiteKey: dto.recaptcha_site_key ?? '',
    recaptchaSecretKeyConfigured: dto.recaptcha_secret_key_configured ?? false,
    capEnabled: dto.cap_enabled ?? false,
    capApiEndpoint: dto.cap_api_endpoint ?? '',
    capSecretKeyConfigured: dto.cap_secret_key_configured ?? false,
    localCaptchaEnabled: dto.local_captcha_enabled ?? false,
    apiKeyAclTrustForwardedIp: dto.api_key_acl_trust_forwarded_ip ?? false,
    clientIpResolutionMode: (dto.client_ip_resolution_mode ?? 'auto_compat') as SystemSettings['clientIpResolutionMode'],
    clientIpTrustedProxies: dto.client_ip_trusted_proxies ?? [],
    clientIpResolutionStatus: toClientIpResolutionStatus(dto.client_ip_resolution_status ?? {} as ClientIpResolutionStatusDto),
    linuxdoConnectEnabled: dto.linuxdo_connect_enabled ?? false,
    linuxdoConnectClientId: dto.linuxdo_connect_client_id ?? '',
    linuxdoConnectClientSecretConfigured: dto.linuxdo_connect_client_secret_configured ?? false,
    linuxdoConnectRedirectUrl: dto.linuxdo_connect_redirect_url ?? '',
    dingtalkConnectEnabled: dto.dingtalk_connect_enabled ?? false,
    dingtalkConnectClientId: dto.dingtalk_connect_client_id ?? '',
    dingtalkConnectClientSecretConfigured: dto.dingtalk_connect_client_secret_configured ?? false,
    dingtalkConnectRedirectUrl: dto.dingtalk_connect_redirect_url ?? '',
    dingtalkConnectCorpRestrictionPolicy: dto.dingtalk_connect_corp_restriction_policy ?? '',
    dingtalkConnectInternalCorpId: dto.dingtalk_connect_internal_corp_id ?? '',
    dingtalkConnectBypassRegistration: dto.dingtalk_connect_bypass_registration ?? false,
    dingtalkConnectSyncCorpEmail: dto.dingtalk_connect_sync_corp_email ?? false,
    dingtalkConnectSyncDisplayName: dto.dingtalk_connect_sync_display_name ?? false,
    dingtalkConnectSyncDept: dto.dingtalk_connect_sync_dept ?? false,
    dingtalkConnectSyncCorpEmailAttrKey: dto.dingtalk_connect_sync_corp_email_attr_key ?? '',
    dingtalkConnectSyncDisplayNameAttrKey: dto.dingtalk_connect_sync_display_name_attr_key ?? '',
    dingtalkConnectSyncDeptAttrKey: dto.dingtalk_connect_sync_dept_attr_key ?? '',
    dingtalkConnectSyncCorpEmailAttrName: dto.dingtalk_connect_sync_corp_email_attr_name ?? '',
    dingtalkConnectSyncDisplayNameAttrName: dto.dingtalk_connect_sync_display_name_attr_name ?? '',
    dingtalkConnectSyncDeptAttrName: dto.dingtalk_connect_sync_dept_attr_name ?? '',
    wechatConnectEnabled: dto.wechat_connect_enabled ?? false,
    wechatConnectAppId: dto.wechat_connect_app_id ?? '',
    wechatConnectAppSecretConfigured: dto.wechat_connect_app_secret_configured ?? false,
    wechatConnectOpenAppId: dto.wechat_connect_open_app_id,
    wechatConnectOpenAppSecretConfigured: dto.wechat_connect_open_app_secret_configured,
    wechatConnectMpAppId: dto.wechat_connect_mp_app_id,
    wechatConnectMpAppSecretConfigured: dto.wechat_connect_mp_app_secret_configured,
    wechatConnectMobileAppId: dto.wechat_connect_mobile_app_id,
    wechatConnectMobileAppSecretConfigured: dto.wechat_connect_mobile_app_secret_configured,
    wechatConnectOpenEnabled: dto.wechat_connect_open_enabled,
    wechatConnectMpEnabled: dto.wechat_connect_mp_enabled,
    wechatConnectMobileEnabled: dto.wechat_connect_mobile_enabled,
    wechatConnectMode: dto.wechat_connect_mode ?? 'open',
    wechatConnectScopes: dto.wechat_connect_scopes ?? '',
    wechatConnectRedirectUrl: dto.wechat_connect_redirect_url ?? '',
    wechatConnectFrontendRedirectUrl: dto.wechat_connect_frontend_redirect_url ?? '',
    oidcConnectEnabled: dto.oidc_connect_enabled ?? false,
    oidcConnectProviderName: dto.oidc_connect_provider_name ?? '',
    oidcConnectClientId: dto.oidc_connect_client_id ?? '',
    oidcConnectClientSecretConfigured: dto.oidc_connect_client_secret_configured ?? false,
    oidcConnectIssuerUrl: dto.oidc_connect_issuer_url ?? '',
    oidcConnectDiscoveryUrl: dto.oidc_connect_discovery_url ?? '',
    oidcConnectAuthorizeUrl: dto.oidc_connect_authorize_url ?? '',
    oidcConnectTokenUrl: dto.oidc_connect_token_url ?? '',
    oidcConnectUserinfoUrl: dto.oidc_connect_userinfo_url ?? '',
    oidcConnectJwksUrl: dto.oidc_connect_jwks_url ?? '',
    oidcConnectScopes: dto.oidc_connect_scopes ?? '',
    oidcConnectRedirectUrl: dto.oidc_connect_redirect_url ?? '',
    oidcConnectFrontendRedirectUrl: dto.oidc_connect_frontend_redirect_url ?? '',
    oidcConnectTokenAuthMethod: dto.oidc_connect_token_auth_method ?? '',
    oidcConnectUsePkce: dto.oidc_connect_use_pkce ?? false,
    oidcConnectValidateIdToken: dto.oidc_connect_validate_id_token ?? false,
    oidcConnectAllowedSigningAlgs: dto.oidc_connect_allowed_signing_algs ?? '',
    oidcConnectClockSkewSeconds: dto.oidc_connect_clock_skew_seconds ?? 0,
    oidcConnectRequireEmailVerified: dto.oidc_connect_require_email_verified ?? false,
    oidcConnectUserinfoEmailPath: dto.oidc_connect_userinfo_email_path ?? '',
    oidcConnectUserinfoIdPath: dto.oidc_connect_userinfo_id_path ?? '',
    oidcConnectUserinfoUsernamePath: dto.oidc_connect_userinfo_username_path ?? '',
    githubOauthEnabled: dto.github_oauth_enabled ?? false,
    githubOauthClientId: dto.github_oauth_client_id ?? '',
    githubOauthClientSecretConfigured: dto.github_oauth_client_secret_configured ?? false,
    githubOauthRedirectUrl: dto.github_oauth_redirect_url ?? '',
    githubOauthFrontendRedirectUrl: dto.github_oauth_frontend_redirect_url ?? '',
    googleOauthEnabled: dto.google_oauth_enabled ?? false,
    googleOauthClientId: dto.google_oauth_client_id ?? '',
    googleOauthClientSecretConfigured: dto.google_oauth_client_secret_configured ?? false,
    googleOauthRedirectUrl: dto.google_oauth_redirect_url ?? '',
    googleOauthFrontendRedirectUrl: dto.google_oauth_frontend_redirect_url ?? '',
    enableModelFallback: dto.enable_model_fallback ?? false,
    fallbackModelAnthropic: dto.fallback_model_anthropic ?? '',
    fallbackModelOpenai: dto.fallback_model_openai ?? '',
    fallbackModelGemini: dto.fallback_model_gemini ?? '',
    fallbackModelAntigravity: dto.fallback_model_antigravity ?? '',
    enableIdentityPatch: dto.enable_identity_patch ?? false,
    identityPatchPrompt: dto.identity_patch_prompt ?? '',
    opsMonitoringEnabled: dto.ops_monitoring_enabled ?? false,
    opsRealtimeMonitoringEnabled: dto.ops_realtime_monitoring_enabled ?? false,
    opsQueryModeDefault: dto.ops_query_mode_default ?? 'auto',
    opsMetricsIntervalSeconds: dto.ops_metrics_interval_seconds ?? 60,
    minClaudeCodeVersion: dto.min_claude_code_version ?? '',
    maxClaudeCodeVersion: dto.max_claude_code_version ?? '',
    allowUngroupedKeyScheduling: dto.allow_ungrouped_key_scheduling ?? false,
    schedulerV2Enabled: dto.scheduler_v2_enabled ?? false,
    schedulerV2Status: dto.scheduler_v2_status ?? '',
    schedulerV2Error: dto.scheduler_v2_error ?? '',
    schedulerV2CandidateLimit: dto.scheduler_v2_candidate_limit ?? 0,
    schedulerV2ScanLimit: dto.scheduler_v2_scan_limit ?? 0,
    enableFingerprintUnification: dto.enable_fingerprint_unification ?? false,
    enableMetadataPassthrough: dto.enable_metadata_passthrough ?? false,
    enableCchSigning: dto.enable_cch_signing ?? false,
    enableClaudeOauthSystemPromptInjection: dto.enable_claude_oauth_system_prompt_injection ?? false,
    claudeOauthSystemPrompt: dto.claude_oauth_system_prompt ?? '',
    claudeOauthSystemPromptBlocks: dto.claude_oauth_system_prompt_blocks ?? '',
    enableAnthropicCacheTtl1hInjection: dto.enable_anthropic_cache_ttl_1h_injection ?? false,
    rewriteMessageCacheControl: dto.rewrite_message_cache_control ?? false,
    enableClientDatelineNormalization: dto.enable_client_dateline_normalization ?? false,
    antigravityUserAgentVersion: dto.antigravity_user_agent_version ?? '',
    openaiCodexUserAgent: dto.openai_codex_user_agent ?? '',
    minCodexVersion: dto.min_codex_version ?? '',
    maxCodexVersion: dto.max_codex_version ?? '',
    codexCliOnlyBlacklist: dto.codex_cli_only_blacklist ?? '',
    codexCliOnlyWhitelist: dto.codex_cli_only_whitelist ?? '',
    codexCliOnlyAllowAppServerClients: dto.codex_cli_only_allow_app_server_clients ?? false,
    codexCliOnlyEngineFingerprintSignals: dto.codex_cli_only_engine_fingerprint_signals ?? '',
    webSearchEmulationEnabled: dto.web_search_emulation_enabled,
    paymentEnabled: dto.payment_enabled ?? false,
    riskControlEnabled: dto.risk_control_enabled ?? false,
    cyberSessionBlockEnabled: dto.cyber_session_block_enabled ?? false,
    cyberSessionBlockTtlSeconds: dto.cyber_session_block_ttl_seconds ?? 0,
    paymentMinAmount: dto.payment_min_amount ?? 0,
    paymentMaxAmount: dto.payment_max_amount ?? 0,
    paymentDailyLimit: dto.payment_daily_limit ?? 0,
    paymentOrderTimeoutMinutes: dto.payment_order_timeout_minutes ?? 30,
    paymentMaxPendingOrders: dto.payment_max_pending_orders ?? 5,
    paymentEnabledTypes: dto.payment_enabled_types ?? [],
    paymentBalanceDisabled: dto.payment_balance_disabled ?? false,
    paymentBalanceRechargeMultiplier: dto.payment_balance_recharge_multiplier ?? 1,
    paymentSubscriptionUsdToCnyRate: dto.payment_subscription_usd_to_cny_rate ?? 7,
    paymentRechargeFeeRate: dto.payment_recharge_fee_rate ?? 0,
    paymentLoadBalanceStrategy: dto.payment_load_balance_strategy ?? '',
    paymentProductNamePrefix: dto.payment_product_name_prefix ?? '',
    paymentProductNameSuffix: dto.payment_product_name_suffix ?? '',
    paymentHelpImageUrl: dto.payment_help_image_url ?? '',
    paymentHelpText: dto.payment_help_text ?? '',
    paymentCancelRateLimitEnabled: dto.payment_cancel_rate_limit_enabled ?? false,
    paymentCancelRateLimitMax: dto.payment_cancel_rate_limit_max ?? 0,
    paymentCancelRateLimitWindow: dto.payment_cancel_rate_limit_window ?? 0,
    paymentCancelRateLimitUnit: dto.payment_cancel_rate_limit_unit ?? '',
    paymentCancelRateLimitWindowMode: dto.payment_cancel_rate_limit_window_mode ?? '',
    paymentAlipayForceQrcode: dto.payment_alipay_force_qrcode,
    paymentVisibleMethodAlipaySource: dto.payment_visible_method_alipay_source,
    paymentVisibleMethodWxpaySource: dto.payment_visible_method_wxpay_source,
    paymentVisibleMethodAlipayEnabled: dto.payment_visible_method_alipay_enabled,
    paymentVisibleMethodWxpayEnabled: dto.payment_visible_method_wxpay_enabled,
    openaiLowUpstreamRatePriorityEnabled: dto.openai_low_upstream_rate_priority_enabled,
    openaiOauthSchedulingRateMultiplier: dto.openai_oauth_scheduling_rate_multiplier,
    openaiAdvancedSchedulerEnabled: dto.openai_advanced_scheduler_enabled,
    openaiAdvancedSchedulerStickyWeightedEnabled: dto.openai_advanced_scheduler_sticky_weighted_enabled,
    openaiAdvancedSchedulerSubscriptionPriorityEnabled: dto.openai_advanced_scheduler_subscription_priority_enabled,
    openaiAdvancedSchedulerLbTopK: dto.openai_advanced_scheduler_lb_top_k,
    openaiAdvancedSchedulerWeightPriority: dto.openai_advanced_scheduler_weight_priority,
    openaiAdvancedSchedulerWeightLoad: dto.openai_advanced_scheduler_weight_load,
    openaiAdvancedSchedulerWeightQueue: dto.openai_advanced_scheduler_weight_queue,
    openaiAdvancedSchedulerWeightErrorRate: dto.openai_advanced_scheduler_weight_error_rate,
    openaiAdvancedSchedulerWeightTtft: dto.openai_advanced_scheduler_weight_ttft,
    openaiAdvancedSchedulerWeightReset: dto.openai_advanced_scheduler_weight_reset,
    openaiAdvancedSchedulerWeightQuotaHeadroom: dto.openai_advanced_scheduler_weight_quota_headroom,
    openaiAdvancedSchedulerWeightUpstreamCost: dto.openai_advanced_scheduler_weight_upstream_cost,
    openaiAdvancedSchedulerWeightPreviousResponse: dto.openai_advanced_scheduler_weight_previous_response,
    openaiAdvancedSchedulerWeightSessionSticky: dto.openai_advanced_scheduler_weight_session_sticky,
    openaiAdvancedSchedulerEffectiveLbTopK: dto.openai_advanced_scheduler_effective_lb_top_k,
    openaiAdvancedSchedulerEffectiveWeightPriority: dto.openai_advanced_scheduler_effective_weight_priority,
    openaiAdvancedSchedulerEffectiveWeightLoad: dto.openai_advanced_scheduler_effective_weight_load,
    openaiAdvancedSchedulerEffectiveWeightQueue: dto.openai_advanced_scheduler_effective_weight_queue,
    openaiAdvancedSchedulerEffectiveWeightErrorRate: dto.openai_advanced_scheduler_effective_weight_error_rate,
    openaiAdvancedSchedulerEffectiveWeightTtft: dto.openai_advanced_scheduler_effective_weight_ttft,
    openaiAdvancedSchedulerEffectiveWeightReset: dto.openai_advanced_scheduler_effective_weight_reset,
    openaiAdvancedSchedulerEffectiveWeightQuotaHeadroom: dto.openai_advanced_scheduler_effective_weight_quota_headroom,
    openaiAdvancedSchedulerEffectiveWeightUpstreamCost: dto.openai_advanced_scheduler_effective_weight_upstream_cost,
    openaiAdvancedSchedulerEffectiveWeightPreviousResponse: dto.openai_advanced_scheduler_effective_weight_previous_response,
    openaiAdvancedSchedulerEffectiveWeightSessionSticky: dto.openai_advanced_scheduler_effective_weight_session_sticky,
    balanceLowNotifyEnabled: dto.balance_low_notify_enabled ?? false,
    balanceLowNotifyThreshold: dto.balance_low_notify_threshold ?? 0,
    balanceLowNotifyRechargeUrl: dto.balance_low_notify_recharge_url ?? '',
    subscriptionExpiryNotifyEnabled: dto.subscription_expiry_notify_enabled ?? false,
    accountQuotaNotifyEnabled: dto.account_quota_notify_enabled ?? false,
    accountQuotaNotifyEmails: dto.account_quota_notify_emails ?? [],
    channelMonitorEnabled: dto.channel_monitor_enabled ?? false,
    channelMonitorDefaultIntervalSeconds: dto.channel_monitor_default_interval_seconds ?? 300,
    availableChannelsEnabled: dto.available_channels_enabled ?? false,
    affiliateEnabled: dto.affiliate_enabled ?? false,
    openaiAdvancedFastPolicySettings: dto.openai_fast_policy_settings,
    allowUserViewErrorRequests: dto.allow_user_view_error_requests ?? false,
    allowUserViewUsageDetails: dto.allow_user_view_usage_details ?? false,
  }
}
