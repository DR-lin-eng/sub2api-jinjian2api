import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SystemSettings } from '@/features/admin-settings/domain/models/adminSettings'
import { ClientIpResolutionStatus } from '@/features/admin-settings/domain/models/clientIpResolutionStatus'

export class AdminSettingsDto {
  @Expose({ name: 'registration_enabled' }) @Transform(({ value }) => value ?? false) registrationEnabled!: boolean
  @Expose({ name: 'email_verify_enabled' }) @Transform(({ value }) => value ?? false) emailVerifyEnabled!: boolean
  @Expose({ name: 'registration_email_suffix_whitelist' }) @Transform(({ value }) => value ?? []) registrationEmailSuffixWhitelist!: string[]
  @Expose({ name: 'promo_code_enabled' }) @Transform(({ value }) => value ?? false) promoCodeEnabled!: boolean
  @Expose({ name: 'password_reset_enabled' }) @Transform(({ value }) => value ?? false) passwordResetEnabled!: boolean
  @Expose({ name: 'frontend_url' }) @Transform(({ value }) => value ?? '') frontendUrl!: string
  @Expose({ name: 'invitation_code_enabled' }) @Transform(({ value }) => value ?? false) invitationCodeEnabled!: boolean
  @Expose({ name: 'totp_enabled' }) @Transform(({ value }) => value ?? false) totpEnabled!: boolean
  @Expose({ name: 'totp_encryption_key_configured' }) @Transform(({ value }) => value ?? false) totpEncryptionKeyConfigured!: boolean
  @Expose({ name: 'passkey_enabled' }) @Transform(({ value }) => value ?? false) passkeyEnabled!: boolean
  @Expose({ name: 'passkey_configured' }) @Transform(({ value }) => value ?? false) passkeyConfigured!: boolean
  @Expose({ name: 'passkey_rp_id' }) @Transform(({ value }) => value ?? '') passkeyRpId!: string
  @Expose({ name: 'passkey_rp_origins' }) @Transform(({ value }) => value ?? []) passkeyRpOrigins!: string[]
  @Expose({ name: 'session_binding_enabled' }) @Transform(({ value }) => value ?? false) sessionBindingEnabled!: boolean
  @Expose({ name: 'step_up_enabled' }) @Transform(({ value }) => value ?? false) stepUpEnabled!: boolean
  @Expose({ name: 'audit_log_retention_days' }) @Transform(({ value }) => value ?? 90) auditLogRetentionDays!: number
  @Expose({ name: 'login_agreement_enabled' }) @Transform(({ value }) => value ?? false) loginAgreementEnabled!: boolean
  @Expose({ name: 'login_agreement_mode' }) @Transform(({ value }) => value ?? 'modal') loginAgreementMode!: string
  @Expose({ name: 'login_agreement_updated_at' }) @Transform(({ value }) => value ?? '') loginAgreementUpdatedAt!: string
  @Expose({ name: 'login_agreement_documents' }) @Transform(({ value }) => value ?? []) loginAgreementDocuments!: unknown[]
  @Expose({ name: 'default_balance' }) @Transform(({ value }) => value ?? 0) defaultBalance!: number
  @Expose({ name: 'affiliate_rebate_rate' }) @Transform(({ value }) => value ?? 0) affiliateRebateRate!: number
  @Expose({ name: 'affiliate_rebate_freeze_hours' }) @Transform(({ value }) => value ?? 0) affiliateRebateFreezeHours!: number
  @Expose({ name: 'affiliate_rebate_duration_days' }) @Transform(({ value }) => value ?? 0) affiliateRebateDurationDays!: number
  @Expose({ name: 'affiliate_rebate_per_invitee_cap' }) @Transform(({ value }) => value ?? 0) affiliateRebatePerInviteeCap!: number
  @Expose({ name: 'affiliate_admin_recharge_enabled' }) @Transform(({ value }) => value ?? false) affiliateAdminRechargeEnabled!: boolean
  @Expose({ name: 'default_concurrency' }) @Transform(({ value }) => value ?? 5) defaultConcurrency!: number
  @Expose({ name: 'default_user_rpm_limit' }) @Transform(({ value }) => value ?? 0) defaultUserRpmLimit!: number
  @Expose({ name: 'default_subscriptions' }) @Transform(({ value }) => value ?? []) defaultSubscriptions!: unknown[]
  @Expose({ name: 'default_platform_quotas' }) defaultPlatformQuotas?: unknown
  @Expose({ name: 'site_name' }) @Transform(({ value }) => value ?? '') siteName!: string
  @Expose({ name: 'site_logo' }) @Transform(({ value }) => value ?? '') siteLogo!: string
  @Expose({ name: 'site_subtitle' }) @Transform(({ value }) => value ?? '') siteSubtitle!: string
  @Expose({ name: 'api_base_url' }) @Transform(({ value }) => value ?? '') apiBaseUrl!: string
  @Expose({ name: 'contact_info' }) @Transform(({ value }) => value ?? '') contactInfo!: string
  @Expose({ name: 'doc_url' }) @Transform(({ value }) => value ?? '') docUrl!: string
  @Expose({ name: 'home_content' }) @Transform(({ value }) => value ?? '') homeContent!: string
  @Expose({ name: 'hide_ccs_import_button' }) @Transform(({ value }) => value ?? false) hideCcsImportButton!: boolean
  @Expose({ name: 'table_default_page_size' }) @Transform(({ value }) => value ?? 20) tableDefaultPageSize!: number
  @Expose({ name: 'table_page_size_options' }) @Transform(({ value }) => value ?? []) tablePageSizeOptions!: number[]
  @Expose({ name: 'backend_mode_enabled' }) @Transform(({ value }) => value ?? false) backendModeEnabled!: boolean
  @Expose({ name: 'stream_mode_performance_enabled' }) @Transform(({ value }) => value ?? false) streamModePerformanceEnabled!: boolean
  @Expose({ name: 'custom_menu_items' }) @Transform(({ value }) => value ?? []) customMenuItems!: unknown[]
  @Expose({ name: 'custom_endpoints' }) @Transform(({ value }) => value ?? []) customEndpoints!: unknown[]
  @Expose({ name: 'smtp_host' }) @Transform(({ value }) => value ?? '') smtpHost!: string
  @Expose({ name: 'smtp_port' }) @Transform(({ value }) => value ?? 25) smtpPort!: number
  @Expose({ name: 'smtp_username' }) @Transform(({ value }) => value ?? '') smtpUsername!: string
  @Expose({ name: 'smtp_password_configured' }) @Transform(({ value }) => value ?? false) smtpPasswordConfigured!: boolean
  @Expose({ name: 'smtp_from_email' }) @Transform(({ value }) => value ?? '') smtpFromEmail!: string
  @Expose({ name: 'smtp_from_name' }) @Transform(({ value }) => value ?? '') smtpFromName!: string
  @Expose({ name: 'smtp_use_tls' }) @Transform(({ value }) => value ?? false) smtpUseTls!: boolean
  @Expose({ name: 'turnstile_enabled' }) @Transform(({ value }) => value ?? false) turnstileEnabled!: boolean
  @Expose({ name: 'turnstile_site_key' }) @Transform(({ value }) => value ?? '') turnstileSiteKey!: string
  @Expose({ name: 'turnstile_secret_key_configured' }) @Transform(({ value }) => value ?? false) turnstileSecretKeyConfigured!: boolean
  @Expose({ name: 'recaptcha_enabled' }) @Transform(({ value }) => value ?? false) recaptchaEnabled!: boolean
  @Expose({ name: 'recaptcha_site_key' }) @Transform(({ value }) => value ?? '') recaptchaSiteKey!: string
  @Expose({ name: 'recaptcha_secret_key_configured' }) @Transform(({ value }) => value ?? false) recaptchaSecretKeyConfigured!: boolean
  @Expose({ name: 'cap_enabled' }) @Transform(({ value }) => value ?? false) capEnabled!: boolean
  @Expose({ name: 'cap_api_endpoint' }) @Transform(({ value }) => value ?? '') capApiEndpoint!: string
  @Expose({ name: 'cap_secret_key_configured' }) @Transform(({ value }) => value ?? false) capSecretKeyConfigured!: boolean
  @Expose({ name: 'local_captcha_enabled' }) @Transform(({ value }) => value ?? false) localCaptchaEnabled!: boolean
  @Expose({ name: 'api_key_acl_trust_forwarded_ip' }) @Transform(({ value }) => value ?? false) apiKeyAclTrustForwardedIp!: boolean
  @Expose({ name: 'client_ip_resolution_mode' }) @Transform(({ value }) => value ?? 'auto_compat') clientIpResolutionMode!: string
  @Expose({ name: 'client_ip_trusted_proxies' }) @Transform(({ value }) => value ?? []) clientIpTrustedProxies!: string[]
  @Expose({ name: 'client_ip_resolution_status' }) clientIpResolutionStatusRaw?: unknown
  @Expose({ name: 'linuxdo_connect_enabled' }) @Transform(({ value }) => value ?? false) linuxdoConnectEnabled!: boolean
  @Expose({ name: 'linuxdo_connect_client_id' }) @Transform(({ value }) => value ?? '') linuxdoConnectClientId!: string
  @Expose({ name: 'linuxdo_connect_client_secret_configured' }) @Transform(({ value }) => value ?? false) linuxdoConnectClientSecretConfigured!: boolean
  @Expose({ name: 'linuxdo_connect_redirect_url' }) @Transform(({ value }) => value ?? '') linuxdoConnectRedirectUrl!: string
  @Expose({ name: 'dingtalk_connect_enabled' }) @Transform(({ value }) => value ?? false) dingtalkConnectEnabled!: boolean
  @Expose({ name: 'dingtalk_connect_client_id' }) @Transform(({ value }) => value ?? '') dingtalkConnectClientId!: string
  @Expose({ name: 'dingtalk_connect_client_secret_configured' }) @Transform(({ value }) => value ?? false) dingtalkConnectClientSecretConfigured!: boolean
  @Expose({ name: 'dingtalk_connect_redirect_url' }) @Transform(({ value }) => value ?? '') dingtalkConnectRedirectUrl!: string
  @Expose({ name: 'dingtalk_connect_corp_restriction_policy' }) @Transform(({ value }) => value ?? '') dingtalkConnectCorpRestrictionPolicy!: string
  @Expose({ name: 'dingtalk_connect_internal_corp_id' }) @Transform(({ value }) => value ?? '') dingtalkConnectInternalCorpId!: string
  @Expose({ name: 'dingtalk_connect_bypass_registration' }) @Transform(({ value }) => value ?? false) dingtalkConnectBypassRegistration!: boolean
  @Expose({ name: 'dingtalk_connect_sync_corp_email' }) @Transform(({ value }) => value ?? false) dingtalkConnectSyncCorpEmail!: boolean
  @Expose({ name: 'dingtalk_connect_sync_display_name' }) @Transform(({ value }) => value ?? false) dingtalkConnectSyncDisplayName!: boolean
  @Expose({ name: 'dingtalk_connect_sync_dept' }) @Transform(({ value }) => value ?? false) dingtalkConnectSyncDept!: boolean
  @Expose({ name: 'dingtalk_connect_sync_corp_email_attr_key' }) @Transform(({ value }) => value ?? '') dingtalkConnectSyncCorpEmailAttrKey!: string
  @Expose({ name: 'dingtalk_connect_sync_display_name_attr_key' }) @Transform(({ value }) => value ?? '') dingtalkConnectSyncDisplayNameAttrKey!: string
  @Expose({ name: 'dingtalk_connect_sync_dept_attr_key' }) @Transform(({ value }) => value ?? '') dingtalkConnectSyncDeptAttrKey!: string
  @Expose({ name: 'dingtalk_connect_sync_corp_email_attr_name' }) @Transform(({ value }) => value ?? '') dingtalkConnectSyncCorpEmailAttrName!: string
  @Expose({ name: 'dingtalk_connect_sync_display_name_attr_name' }) @Transform(({ value }) => value ?? '') dingtalkConnectSyncDisplayNameAttrName!: string
  @Expose({ name: 'dingtalk_connect_sync_dept_attr_name' }) @Transform(({ value }) => value ?? '') dingtalkConnectSyncDeptAttrName!: string
  @Expose({ name: 'wechat_connect_enabled' }) @Transform(({ value }) => value ?? false) wechatConnectEnabled!: boolean
  @Expose({ name: 'wechat_connect_app_id' }) @Transform(({ value }) => value ?? '') wechatConnectAppId!: string
  @Expose({ name: 'wechat_connect_app_secret_configured' }) @Transform(({ value }) => value ?? false) wechatConnectAppSecretConfigured!: boolean
  @Expose({ name: 'wechat_connect_open_app_id' }) wechatConnectOpenAppId?: string
  @Expose({ name: 'wechat_connect_open_app_secret_configured' }) wechatConnectOpenAppSecretConfigured?: boolean
  @Expose({ name: 'wechat_connect_mp_app_id' }) wechatConnectMpAppId?: string
  @Expose({ name: 'wechat_connect_mp_app_secret_configured' }) wechatConnectMpAppSecretConfigured?: boolean
  @Expose({ name: 'wechat_connect_mobile_app_id' }) wechatConnectMobileAppId?: string
  @Expose({ name: 'wechat_connect_mobile_app_secret_configured' }) wechatConnectMobileAppSecretConfigured?: boolean
  @Expose({ name: 'wechat_connect_open_enabled' }) wechatConnectOpenEnabled?: boolean
  @Expose({ name: 'wechat_connect_mp_enabled' }) wechatConnectMpEnabled?: boolean
  @Expose({ name: 'wechat_connect_mobile_enabled' }) wechatConnectMobileEnabled?: boolean
  @Expose({ name: 'wechat_connect_mode' }) @Transform(({ value }) => value ?? 'open') wechatConnectMode!: string
  @Expose({ name: 'wechat_connect_scopes' }) @Transform(({ value }) => value ?? '') wechatConnectScopes!: string
  @Expose({ name: 'wechat_connect_redirect_url' }) @Transform(({ value }) => value ?? '') wechatConnectRedirectUrl!: string
  @Expose({ name: 'wechat_connect_frontend_redirect_url' }) @Transform(({ value }) => value ?? '') wechatConnectFrontendRedirectUrl!: string
  @Expose({ name: 'oidc_connect_enabled' }) @Transform(({ value }) => value ?? false) oidcConnectEnabled!: boolean
  @Expose({ name: 'oidc_connect_provider_name' }) @Transform(({ value }) => value ?? '') oidcConnectProviderName!: string
  @Expose({ name: 'oidc_connect_client_id' }) @Transform(({ value }) => value ?? '') oidcConnectClientId!: string
  @Expose({ name: 'oidc_connect_client_secret_configured' }) @Transform(({ value }) => value ?? false) oidcConnectClientSecretConfigured!: boolean
  @Expose({ name: 'oidc_connect_issuer_url' }) @Transform(({ value }) => value ?? '') oidcConnectIssuerUrl!: string
  @Expose({ name: 'oidc_connect_discovery_url' }) @Transform(({ value }) => value ?? '') oidcConnectDiscoveryUrl!: string
  @Expose({ name: 'oidc_connect_authorize_url' }) @Transform(({ value }) => value ?? '') oidcConnectAuthorizeUrl!: string
  @Expose({ name: 'oidc_connect_token_url' }) @Transform(({ value }) => value ?? '') oidcConnectTokenUrl!: string
  @Expose({ name: 'oidc_connect_userinfo_url' }) @Transform(({ value }) => value ?? '') oidcConnectUserinfoUrl!: string
  @Expose({ name: 'oidc_connect_jwks_url' }) @Transform(({ value }) => value ?? '') oidcConnectJwksUrl!: string
  @Expose({ name: 'oidc_connect_scopes' }) @Transform(({ value }) => value ?? '') oidcConnectScopes!: string
  @Expose({ name: 'oidc_connect_redirect_url' }) @Transform(({ value }) => value ?? '') oidcConnectRedirectUrl!: string
  @Expose({ name: 'oidc_connect_frontend_redirect_url' }) @Transform(({ value }) => value ?? '') oidcConnectFrontendRedirectUrl!: string
  @Expose({ name: 'oidc_connect_token_auth_method' }) @Transform(({ value }) => value ?? '') oidcConnectTokenAuthMethod!: string
  @Expose({ name: 'oidc_connect_use_pkce' }) @Transform(({ value }) => value ?? false) oidcConnectUsePkce!: boolean
  @Expose({ name: 'oidc_connect_validate_id_token' }) @Transform(({ value }) => value ?? false) oidcConnectValidateIdToken!: boolean
  @Expose({ name: 'oidc_connect_allowed_signing_algs' }) @Transform(({ value }) => value ?? '') oidcConnectAllowedSigningAlgs!: string
  @Expose({ name: 'oidc_connect_clock_skew_seconds' }) @Transform(({ value }) => value ?? 0) oidcConnectClockSkewSeconds!: number
  @Expose({ name: 'oidc_connect_require_email_verified' }) @Transform(({ value }) => value ?? false) oidcConnectRequireEmailVerified!: boolean
  @Expose({ name: 'oidc_connect_userinfo_email_path' }) @Transform(({ value }) => value ?? '') oidcConnectUserinfoEmailPath!: string
  @Expose({ name: 'oidc_connect_userinfo_id_path' }) @Transform(({ value }) => value ?? '') oidcConnectUserinfoIdPath!: string
  @Expose({ name: 'oidc_connect_userinfo_username_path' }) @Transform(({ value }) => value ?? '') oidcConnectUserinfoUsernamePath!: string
  @Expose({ name: 'github_oauth_enabled' }) @Transform(({ value }) => value ?? false) githubOauthEnabled!: boolean
  @Expose({ name: 'github_oauth_client_id' }) @Transform(({ value }) => value ?? '') githubOauthClientId!: string
  @Expose({ name: 'github_oauth_client_secret_configured' }) @Transform(({ value }) => value ?? false) githubOauthClientSecretConfigured!: boolean
  @Expose({ name: 'github_oauth_redirect_url' }) @Transform(({ value }) => value ?? '') githubOauthRedirectUrl!: string
  @Expose({ name: 'github_oauth_frontend_redirect_url' }) @Transform(({ value }) => value ?? '') githubOauthFrontendRedirectUrl!: string
  @Expose({ name: 'google_oauth_enabled' }) @Transform(({ value }) => value ?? false) googleOauthEnabled!: boolean
  @Expose({ name: 'google_oauth_client_id' }) @Transform(({ value }) => value ?? '') googleOauthClientId!: string
  @Expose({ name: 'google_oauth_client_secret_configured' }) @Transform(({ value }) => value ?? false) googleOauthClientSecretConfigured!: boolean
  @Expose({ name: 'google_oauth_redirect_url' }) @Transform(({ value }) => value ?? '') googleOauthRedirectUrl!: string
  @Expose({ name: 'google_oauth_frontend_redirect_url' }) @Transform(({ value }) => value ?? '') googleOauthFrontendRedirectUrl!: string
  @Expose({ name: 'enable_model_fallback' }) @Transform(({ value }) => value ?? false) enableModelFallback!: boolean
  @Expose({ name: 'fallback_model_anthropic' }) @Transform(({ value }) => value ?? '') fallbackModelAnthropic!: string
  @Expose({ name: 'fallback_model_openai' }) @Transform(({ value }) => value ?? '') fallbackModelOpenai!: string
  @Expose({ name: 'fallback_model_gemini' }) @Transform(({ value }) => value ?? '') fallbackModelGemini!: string
  @Expose({ name: 'fallback_model_antigravity' }) @Transform(({ value }) => value ?? '') fallbackModelAntigravity!: string
  @Expose({ name: 'enable_identity_patch' }) @Transform(({ value }) => value ?? false) enableIdentityPatch!: boolean
  @Expose({ name: 'identity_patch_prompt' }) @Transform(({ value }) => value ?? '') identityPatchPrompt!: string
  @Expose({ name: 'ops_monitoring_enabled' }) @Transform(({ value }) => value ?? false) opsMonitoringEnabled!: boolean
  @Expose({ name: 'ops_realtime_monitoring_enabled' }) @Transform(({ value }) => value ?? false) opsRealtimeMonitoringEnabled!: boolean
  @Expose({ name: 'ops_query_mode_default' }) @Transform(({ value }) => value ?? 'auto') opsQueryModeDefault!: string
  @Expose({ name: 'ops_metrics_interval_seconds' }) @Transform(({ value }) => value ?? 60) opsMetricsIntervalSeconds!: number
  @Expose({ name: 'min_claude_code_version' }) @Transform(({ value }) => value ?? '') minClaudeCodeVersion!: string
  @Expose({ name: 'max_claude_code_version' }) @Transform(({ value }) => value ?? '') maxClaudeCodeVersion!: string
  @Expose({ name: 'allow_ungrouped_key_scheduling' }) @Transform(({ value }) => value ?? false) allowUngroupedKeyScheduling!: boolean
  @Expose({ name: 'scheduler_v2_enabled' }) @Transform(({ value }) => value ?? false) schedulerV2Enabled!: boolean
  @Expose({ name: 'scheduler_v2_status' }) @Transform(({ value }) => value ?? '') schedulerV2Status!: string
  @Expose({ name: 'scheduler_v2_error' }) @Transform(({ value }) => value ?? '') schedulerV2Error!: string
  @Expose({ name: 'scheduler_v2_candidate_limit' }) @Transform(({ value }) => value ?? 0) schedulerV2CandidateLimit!: number
  @Expose({ name: 'scheduler_v2_scan_limit' }) @Transform(({ value }) => value ?? 0) schedulerV2ScanLimit!: number
  @Expose({ name: 'enable_fingerprint_unification' }) @Transform(({ value }) => value ?? false) enableFingerprintUnification!: boolean
  @Expose({ name: 'enable_metadata_passthrough' }) @Transform(({ value }) => value ?? false) enableMetadataPassthrough!: boolean
  @Expose({ name: 'enable_cch_signing' }) @Transform(({ value }) => value ?? false) enableCchSigning!: boolean
  @Expose({ name: 'enable_claude_oauth_system_prompt_injection' }) @Transform(({ value }) => value ?? false) enableClaudeOauthSystemPromptInjection!: boolean
  @Expose({ name: 'claude_oauth_system_prompt' }) @Transform(({ value }) => value ?? '') claudeOauthSystemPrompt!: string
  @Expose({ name: 'claude_oauth_system_prompt_blocks' }) @Transform(({ value }) => value ?? '') claudeOauthSystemPromptBlocks!: string
  @Expose({ name: 'enable_anthropic_cache_ttl_1h_injection' }) @Transform(({ value }) => value ?? false) enableAnthropicCacheTtl1hInjection!: boolean
  @Expose({ name: 'rewrite_message_cache_control' }) @Transform(({ value }) => value ?? false) rewriteMessageCacheControl!: boolean
  @Expose({ name: 'enable_client_dateline_normalization' }) @Transform(({ value }) => value ?? false) enableClientDatelineNormalization!: boolean
  @Expose({ name: 'antigravity_user_agent_version' }) @Transform(({ value }) => value ?? '') antigravityUserAgentVersion!: string
  @Expose({ name: 'openai_codex_user_agent' }) @Transform(({ value }) => value ?? '') openaiCodexUserAgent!: string
  @Expose({ name: 'min_codex_version' }) @Transform(({ value }) => value ?? '') minCodexVersion!: string
  @Expose({ name: 'max_codex_version' }) @Transform(({ value }) => value ?? '') maxCodexVersion!: string
  @Expose({ name: 'codex_cli_only_blacklist' }) @Transform(({ value }) => value ?? '') codexCliOnlyBlacklist!: string
  @Expose({ name: 'codex_cli_only_whitelist' }) @Transform(({ value }) => value ?? '') codexCliOnlyWhitelist!: string
  @Expose({ name: 'codex_cli_only_allow_app_server_clients' }) @Transform(({ value }) => value ?? false) codexCliOnlyAllowAppServerClients!: boolean
  @Expose({ name: 'codex_cli_only_engine_fingerprint_signals' }) @Transform(({ value }) => value ?? '') codexCliOnlyEngineFingerprintSignals!: string
  @Expose({ name: 'web_search_emulation_enabled' }) webSearchEmulationEnabled?: boolean
  @Expose({ name: 'payment_enabled' }) @Transform(({ value }) => value ?? false) paymentEnabled!: boolean
  @Expose({ name: 'risk_control_enabled' }) @Transform(({ value }) => value ?? false) riskControlEnabled!: boolean
  @Expose({ name: 'cyber_session_block_enabled' }) @Transform(({ value }) => value ?? false) cyberSessionBlockEnabled!: boolean
  @Expose({ name: 'cyber_session_block_ttl_seconds' }) @Transform(({ value }) => value ?? 0) cyberSessionBlockTtlSeconds!: number
  @Expose({ name: 'payment_min_amount' }) @Transform(({ value }) => value ?? 0) paymentMinAmount!: number
  @Expose({ name: 'payment_max_amount' }) @Transform(({ value }) => value ?? 0) paymentMaxAmount!: number
  @Expose({ name: 'payment_daily_limit' }) @Transform(({ value }) => value ?? 0) paymentDailyLimit!: number
  @Expose({ name: 'payment_order_timeout_minutes' }) @Transform(({ value }) => value ?? 30) paymentOrderTimeoutMinutes!: number
  @Expose({ name: 'payment_max_pending_orders' }) @Transform(({ value }) => value ?? 5) paymentMaxPendingOrders!: number
  @Expose({ name: 'payment_enabled_types' }) @Transform(({ value }) => value ?? []) paymentEnabledTypes!: string[]
  @Expose({ name: 'payment_balance_disabled' }) @Transform(({ value }) => value ?? false) paymentBalanceDisabled!: boolean
  @Expose({ name: 'payment_balance_recharge_multiplier' }) @Transform(({ value }) => value ?? 1) paymentBalanceRechargeMultiplier!: number
  @Expose({ name: 'payment_subscription_usd_to_cny_rate' }) @Transform(({ value }) => value ?? 7) paymentSubscriptionUsdToCnyRate!: number
  @Expose({ name: 'payment_recharge_fee_rate' }) @Transform(({ value }) => value ?? 0) paymentRechargeFeeRate!: number
  @Expose({ name: 'payment_load_balance_strategy' }) @Transform(({ value }) => value ?? '') paymentLoadBalanceStrategy!: string
  @Expose({ name: 'payment_product_name_prefix' }) @Transform(({ value }) => value ?? '') paymentProductNamePrefix!: string
  @Expose({ name: 'payment_product_name_suffix' }) @Transform(({ value }) => value ?? '') paymentProductNameSuffix!: string
  @Expose({ name: 'payment_help_image_url' }) @Transform(({ value }) => value ?? '') paymentHelpImageUrl!: string
  @Expose({ name: 'payment_help_text' }) @Transform(({ value }) => value ?? '') paymentHelpText!: string
  @Expose({ name: 'payment_cancel_rate_limit_enabled' }) @Transform(({ value }) => value ?? false) paymentCancelRateLimitEnabled!: boolean
  @Expose({ name: 'payment_cancel_rate_limit_max' }) @Transform(({ value }) => value ?? 0) paymentCancelRateLimitMax!: number
  @Expose({ name: 'payment_cancel_rate_limit_window' }) @Transform(({ value }) => value ?? 0) paymentCancelRateLimitWindow!: number
  @Expose({ name: 'payment_cancel_rate_limit_unit' }) @Transform(({ value }) => value ?? '') paymentCancelRateLimitUnit!: string
  @Expose({ name: 'payment_cancel_rate_limit_window_mode' }) @Transform(({ value }) => value ?? '') paymentCancelRateLimitWindowMode!: string
  @Expose({ name: 'payment_alipay_force_qrcode' }) paymentAlipayForceQrcode?: boolean
  @Expose({ name: 'payment_visible_method_alipay_source' }) paymentVisibleMethodAlipaySource?: string
  @Expose({ name: 'payment_visible_method_wxpay_source' }) paymentVisibleMethodWxpaySource?: string
  @Expose({ name: 'payment_visible_method_alipay_enabled' }) paymentVisibleMethodAlipayEnabled?: boolean
  @Expose({ name: 'payment_visible_method_wxpay_enabled' }) paymentVisibleMethodWxpayEnabled?: boolean
  @Expose({ name: 'openai_low_upstream_rate_priority_enabled' }) openaiLowUpstreamRatePriorityEnabled?: boolean
  @Expose({ name: 'openai_oauth_scheduling_rate_multiplier' }) openaiOauthSchedulingRateMultiplier?: number
  @Expose({ name: 'openai_advanced_scheduler_enabled' }) openaiAdvancedSchedulerEnabled?: boolean
  @Expose({ name: 'openai_advanced_scheduler_sticky_weighted_enabled' }) openaiAdvancedSchedulerStickyWeightedEnabled?: boolean
  @Expose({ name: 'openai_advanced_scheduler_subscription_priority_enabled' }) openaiAdvancedSchedulerSubscriptionPriorityEnabled?: boolean
  @Expose({ name: 'openai_advanced_scheduler_lb_top_k' }) openaiAdvancedSchedulerLbTopK?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_priority' }) openaiAdvancedSchedulerWeightPriority?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_load' }) openaiAdvancedSchedulerWeightLoad?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_queue' }) openaiAdvancedSchedulerWeightQueue?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_error_rate' }) openaiAdvancedSchedulerWeightErrorRate?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_ttft' }) openaiAdvancedSchedulerWeightTtft?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_reset' }) openaiAdvancedSchedulerWeightReset?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_quota_headroom' }) openaiAdvancedSchedulerWeightQuotaHeadroom?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_upstream_cost' }) openaiAdvancedSchedulerWeightUpstreamCost?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_previous_response' }) openaiAdvancedSchedulerWeightPreviousResponse?: string
  @Expose({ name: 'openai_advanced_scheduler_weight_session_sticky' }) openaiAdvancedSchedulerWeightSessionSticky?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_lb_top_k' }) openaiAdvancedSchedulerEffectiveLbTopK?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_priority' }) openaiAdvancedSchedulerEffectiveWeightPriority?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_load' }) openaiAdvancedSchedulerEffectiveWeightLoad?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_queue' }) openaiAdvancedSchedulerEffectiveWeightQueue?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_error_rate' }) openaiAdvancedSchedulerEffectiveWeightErrorRate?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_ttft' }) openaiAdvancedSchedulerEffectiveWeightTtft?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_reset' }) openaiAdvancedSchedulerEffectiveWeightReset?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_quota_headroom' }) openaiAdvancedSchedulerEffectiveWeightQuotaHeadroom?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_upstream_cost' }) openaiAdvancedSchedulerEffectiveWeightUpstreamCost?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_previous_response' }) openaiAdvancedSchedulerEffectiveWeightPreviousResponse?: string
  @Expose({ name: 'openai_advanced_scheduler_effective_weight_session_sticky' }) openaiAdvancedSchedulerEffectiveWeightSessionSticky?: string
  @Expose({ name: 'balance_low_notify_enabled' }) @Transform(({ value }) => value ?? false) balanceLowNotifyEnabled!: boolean
  @Expose({ name: 'balance_low_notify_threshold' }) @Transform(({ value }) => value ?? 0) balanceLowNotifyThreshold!: number
  @Expose({ name: 'balance_low_notify_recharge_url' }) @Transform(({ value }) => value ?? '') balanceLowNotifyRechargeUrl!: string
  @Expose({ name: 'subscription_expiry_notify_enabled' }) @Transform(({ value }) => value ?? false) subscriptionExpiryNotifyEnabled!: boolean
  @Expose({ name: 'account_quota_notify_enabled' }) @Transform(({ value }) => value ?? false) accountQuotaNotifyEnabled!: boolean
  @Expose({ name: 'account_quota_notify_emails' }) @Transform(({ value }) => value ?? []) accountQuotaNotifyEmails!: unknown[]
  @Expose({ name: 'channel_monitor_enabled' }) @Transform(({ value }) => value ?? false) channelMonitorEnabled!: boolean
  @Expose({ name: 'channel_monitor_default_interval_seconds' }) @Transform(({ value }) => value ?? 300) channelMonitorDefaultIntervalSeconds!: number
  @Expose({ name: 'available_channels_enabled' }) @Transform(({ value }) => value ?? false) availableChannelsEnabled!: boolean
  @Expose({ name: 'affiliate_enabled' }) @Transform(({ value }) => value ?? false) affiliateEnabled!: boolean
  @Expose({ name: 'openai_fast_policy_settings' }) openaiAdvancedFastPolicySettings?: unknown
  @Expose({ name: 'allow_user_view_error_requests' }) @Transform(({ value }) => value ?? false) allowUserViewErrorRequests!: boolean
  @Expose({ name: 'allow_user_view_usage_details' }) @Transform(({ value }) => value ?? false) allowUserViewUsageDetails!: boolean

  static fromJson(json: unknown): AdminSettingsDto {
    return plainToInstance(AdminSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SystemSettings {
    const e = new SystemSettings()
    e.registrationEnabled = this.registrationEnabled
    e.emailVerifyEnabled = this.emailVerifyEnabled
    e.registrationEmailSuffixWhitelist = this.registrationEmailSuffixWhitelist
    e.promoCodeEnabled = this.promoCodeEnabled
    e.passwordResetEnabled = this.passwordResetEnabled
    e.frontendUrl = this.frontendUrl
    e.invitationCodeEnabled = this.invitationCodeEnabled
    e.totpEnabled = this.totpEnabled
    e.totpEncryptionKeyConfigured = this.totpEncryptionKeyConfigured
    e.passkeyEnabled = this.passkeyEnabled
    e.passkeyConfigured = this.passkeyConfigured
    e.passkeyRpId = this.passkeyRpId
    e.passkeyRpOrigins = this.passkeyRpOrigins
    e.sessionBindingEnabled = this.sessionBindingEnabled
    e.stepUpEnabled = this.stepUpEnabled
    e.auditLogRetentionDays = this.auditLogRetentionDays
    e.loginAgreementEnabled = this.loginAgreementEnabled
    e.loginAgreementMode = this.loginAgreementMode
    e.loginAgreementUpdatedAt = this.loginAgreementUpdatedAt
    e.loginAgreementDocuments = this.loginAgreementDocuments as SystemSettings['loginAgreementDocuments']
    e.defaultBalance = this.defaultBalance
    e.affiliateRebateRate = this.affiliateRebateRate
    e.affiliateRebateFreezeHours = this.affiliateRebateFreezeHours
    e.affiliateRebateDurationDays = this.affiliateRebateDurationDays
    e.affiliateRebatePerInviteeCap = this.affiliateRebatePerInviteeCap
    e.affiliateAdminRechargeEnabled = this.affiliateAdminRechargeEnabled
    e.defaultConcurrency = this.defaultConcurrency
    e.defaultUserRpmLimit = this.defaultUserRpmLimit
    e.defaultSubscriptions = this.defaultSubscriptions as SystemSettings['defaultSubscriptions']
    e.defaultPlatformQuotas = this.defaultPlatformQuotas as SystemSettings['defaultPlatformQuotas']
    e.siteName = this.siteName
    e.siteLogo = this.siteLogo
    e.siteSubtitle = this.siteSubtitle
    e.apiBaseUrl = this.apiBaseUrl
    e.contactInfo = this.contactInfo
    e.docUrl = this.docUrl
    e.homeContent = this.homeContent
    e.hideCcsImportButton = this.hideCcsImportButton
    e.tableDefaultPageSize = this.tableDefaultPageSize
    e.tablePageSizeOptions = this.tablePageSizeOptions
    e.backendModeEnabled = this.backendModeEnabled
    e.streamModePerformanceEnabled = this.streamModePerformanceEnabled
    e.customMenuItems = this.customMenuItems as SystemSettings['customMenuItems']
    e.customEndpoints = this.customEndpoints as SystemSettings['customEndpoints']
    e.smtpHost = this.smtpHost
    e.smtpPort = this.smtpPort
    e.smtpUsername = this.smtpUsername
    e.smtpPasswordConfigured = this.smtpPasswordConfigured
    e.smtpFromEmail = this.smtpFromEmail
    e.smtpFromName = this.smtpFromName
    e.smtpUseTls = this.smtpUseTls
    e.turnstileEnabled = this.turnstileEnabled
    e.turnstileSiteKey = this.turnstileSiteKey
    e.turnstileSecretKeyConfigured = this.turnstileSecretKeyConfigured
    e.recaptchaEnabled = this.recaptchaEnabled
    e.recaptchaSiteKey = this.recaptchaSiteKey
    e.recaptchaSecretKeyConfigured = this.recaptchaSecretKeyConfigured
    e.capEnabled = this.capEnabled
    e.capApiEndpoint = this.capApiEndpoint
    e.capSecretKeyConfigured = this.capSecretKeyConfigured
    e.localCaptchaEnabled = this.localCaptchaEnabled
    e.apiKeyAclTrustForwardedIp = this.apiKeyAclTrustForwardedIp
    e.clientIpResolutionMode = this.clientIpResolutionMode as SystemSettings['clientIpResolutionMode']
    e.clientIpTrustedProxies = this.clientIpTrustedProxies
    const rawStatus = (this.clientIpResolutionStatusRaw ?? {}) as Record<string, unknown>
    const s = new ClientIpResolutionStatus()
    s.mode = ((rawStatus.mode as string) ?? 'auto_compat') as ClientIpResolutionStatus['mode']
    s.customPrefixCount = (rawStatus.custom_prefix_count as number) ?? 0
    s.staticPrefixCount = (rawStatus.static_prefix_count as number) ?? 0
    s.cloudflarePrefixCount = (rawStatus.cloudflare_prefix_count as number) ?? 0
    s.cloudflareRangesSource = ((rawStatus.cloudflare_ranges_source as string) ?? 'embedded') as ClientIpResolutionStatus['cloudflareRangesSource']
    s.cloudflareLastSuccessAt = (rawStatus.cloudflare_last_success_at as string | null) ?? null
    e.clientIpResolutionStatus = s
    e.linuxdoConnectEnabled = this.linuxdoConnectEnabled
    e.linuxdoConnectClientId = this.linuxdoConnectClientId
    e.linuxdoConnectClientSecretConfigured = this.linuxdoConnectClientSecretConfigured
    e.linuxdoConnectRedirectUrl = this.linuxdoConnectRedirectUrl
    e.dingtalkConnectEnabled = this.dingtalkConnectEnabled
    e.dingtalkConnectClientId = this.dingtalkConnectClientId
    e.dingtalkConnectClientSecretConfigured = this.dingtalkConnectClientSecretConfigured
    e.dingtalkConnectRedirectUrl = this.dingtalkConnectRedirectUrl
    e.dingtalkConnectCorpRestrictionPolicy = this.dingtalkConnectCorpRestrictionPolicy
    e.dingtalkConnectInternalCorpId = this.dingtalkConnectInternalCorpId
    e.dingtalkConnectBypassRegistration = this.dingtalkConnectBypassRegistration
    e.dingtalkConnectSyncCorpEmail = this.dingtalkConnectSyncCorpEmail
    e.dingtalkConnectSyncDisplayName = this.dingtalkConnectSyncDisplayName
    e.dingtalkConnectSyncDept = this.dingtalkConnectSyncDept
    e.dingtalkConnectSyncCorpEmailAttrKey = this.dingtalkConnectSyncCorpEmailAttrKey
    e.dingtalkConnectSyncDisplayNameAttrKey = this.dingtalkConnectSyncDisplayNameAttrKey
    e.dingtalkConnectSyncDeptAttrKey = this.dingtalkConnectSyncDeptAttrKey
    e.dingtalkConnectSyncCorpEmailAttrName = this.dingtalkConnectSyncCorpEmailAttrName
    e.dingtalkConnectSyncDisplayNameAttrName = this.dingtalkConnectSyncDisplayNameAttrName
    e.dingtalkConnectSyncDeptAttrName = this.dingtalkConnectSyncDeptAttrName
    e.wechatConnectEnabled = this.wechatConnectEnabled
    e.wechatConnectAppId = this.wechatConnectAppId
    e.wechatConnectAppSecretConfigured = this.wechatConnectAppSecretConfigured
    e.wechatConnectOpenAppId = this.wechatConnectOpenAppId
    e.wechatConnectOpenAppSecretConfigured = this.wechatConnectOpenAppSecretConfigured
    e.wechatConnectMpAppId = this.wechatConnectMpAppId
    e.wechatConnectMpAppSecretConfigured = this.wechatConnectMpAppSecretConfigured
    e.wechatConnectMobileAppId = this.wechatConnectMobileAppId
    e.wechatConnectMobileAppSecretConfigured = this.wechatConnectMobileAppSecretConfigured
    e.wechatConnectOpenEnabled = this.wechatConnectOpenEnabled
    e.wechatConnectMpEnabled = this.wechatConnectMpEnabled
    e.wechatConnectMobileEnabled = this.wechatConnectMobileEnabled
    e.wechatConnectMode = this.wechatConnectMode
    e.wechatConnectScopes = this.wechatConnectScopes
    e.wechatConnectRedirectUrl = this.wechatConnectRedirectUrl
    e.wechatConnectFrontendRedirectUrl = this.wechatConnectFrontendRedirectUrl
    e.oidcConnectEnabled = this.oidcConnectEnabled
    e.oidcConnectProviderName = this.oidcConnectProviderName
    e.oidcConnectClientId = this.oidcConnectClientId
    e.oidcConnectClientSecretConfigured = this.oidcConnectClientSecretConfigured
    e.oidcConnectIssuerUrl = this.oidcConnectIssuerUrl
    e.oidcConnectDiscoveryUrl = this.oidcConnectDiscoveryUrl
    e.oidcConnectAuthorizeUrl = this.oidcConnectAuthorizeUrl
    e.oidcConnectTokenUrl = this.oidcConnectTokenUrl
    e.oidcConnectUserinfoUrl = this.oidcConnectUserinfoUrl
    e.oidcConnectJwksUrl = this.oidcConnectJwksUrl
    e.oidcConnectScopes = this.oidcConnectScopes
    e.oidcConnectRedirectUrl = this.oidcConnectRedirectUrl
    e.oidcConnectFrontendRedirectUrl = this.oidcConnectFrontendRedirectUrl
    e.oidcConnectTokenAuthMethod = this.oidcConnectTokenAuthMethod
    e.oidcConnectUsePkce = this.oidcConnectUsePkce
    e.oidcConnectValidateIdToken = this.oidcConnectValidateIdToken
    e.oidcConnectAllowedSigningAlgs = this.oidcConnectAllowedSigningAlgs
    e.oidcConnectClockSkewSeconds = this.oidcConnectClockSkewSeconds
    e.oidcConnectRequireEmailVerified = this.oidcConnectRequireEmailVerified
    e.oidcConnectUserinfoEmailPath = this.oidcConnectUserinfoEmailPath
    e.oidcConnectUserinfoIdPath = this.oidcConnectUserinfoIdPath
    e.oidcConnectUserinfoUsernamePath = this.oidcConnectUserinfoUsernamePath
    e.githubOauthEnabled = this.githubOauthEnabled
    e.githubOauthClientId = this.githubOauthClientId
    e.githubOauthClientSecretConfigured = this.githubOauthClientSecretConfigured
    e.githubOauthRedirectUrl = this.githubOauthRedirectUrl
    e.githubOauthFrontendRedirectUrl = this.githubOauthFrontendRedirectUrl
    e.googleOauthEnabled = this.googleOauthEnabled
    e.googleOauthClientId = this.googleOauthClientId
    e.googleOauthClientSecretConfigured = this.googleOauthClientSecretConfigured
    e.googleOauthRedirectUrl = this.googleOauthRedirectUrl
    e.googleOauthFrontendRedirectUrl = this.googleOauthFrontendRedirectUrl
    e.enableModelFallback = this.enableModelFallback
    e.fallbackModelAnthropic = this.fallbackModelAnthropic
    e.fallbackModelOpenai = this.fallbackModelOpenai
    e.fallbackModelGemini = this.fallbackModelGemini
    e.fallbackModelAntigravity = this.fallbackModelAntigravity
    e.enableIdentityPatch = this.enableIdentityPatch
    e.identityPatchPrompt = this.identityPatchPrompt
    e.opsMonitoringEnabled = this.opsMonitoringEnabled
    e.opsRealtimeMonitoringEnabled = this.opsRealtimeMonitoringEnabled
    e.opsQueryModeDefault = this.opsQueryModeDefault
    e.opsMetricsIntervalSeconds = this.opsMetricsIntervalSeconds
    e.minClaudeCodeVersion = this.minClaudeCodeVersion
    e.maxClaudeCodeVersion = this.maxClaudeCodeVersion
    e.allowUngroupedKeyScheduling = this.allowUngroupedKeyScheduling
    e.schedulerV2Enabled = this.schedulerV2Enabled
    e.schedulerV2Status = this.schedulerV2Status
    e.schedulerV2Error = this.schedulerV2Error
    e.schedulerV2CandidateLimit = this.schedulerV2CandidateLimit
    e.schedulerV2ScanLimit = this.schedulerV2ScanLimit
    e.enableFingerprintUnification = this.enableFingerprintUnification
    e.enableMetadataPassthrough = this.enableMetadataPassthrough
    e.enableCchSigning = this.enableCchSigning
    e.enableClaudeOauthSystemPromptInjection = this.enableClaudeOauthSystemPromptInjection
    e.claudeOauthSystemPrompt = this.claudeOauthSystemPrompt
    e.claudeOauthSystemPromptBlocks = this.claudeOauthSystemPromptBlocks
    e.enableAnthropicCacheTtl1hInjection = this.enableAnthropicCacheTtl1hInjection
    e.rewriteMessageCacheControl = this.rewriteMessageCacheControl
    e.enableClientDatelineNormalization = this.enableClientDatelineNormalization
    e.antigravityUserAgentVersion = this.antigravityUserAgentVersion
    e.openaiCodexUserAgent = this.openaiCodexUserAgent
    e.minCodexVersion = this.minCodexVersion
    e.maxCodexVersion = this.maxCodexVersion
    e.codexCliOnlyBlacklist = this.codexCliOnlyBlacklist
    e.codexCliOnlyWhitelist = this.codexCliOnlyWhitelist
    e.codexCliOnlyAllowAppServerClients = this.codexCliOnlyAllowAppServerClients
    e.codexCliOnlyEngineFingerprintSignals = this.codexCliOnlyEngineFingerprintSignals
    e.webSearchEmulationEnabled = this.webSearchEmulationEnabled
    e.paymentEnabled = this.paymentEnabled
    e.riskControlEnabled = this.riskControlEnabled
    e.cyberSessionBlockEnabled = this.cyberSessionBlockEnabled
    e.cyberSessionBlockTtlSeconds = this.cyberSessionBlockTtlSeconds
    e.paymentMinAmount = this.paymentMinAmount
    e.paymentMaxAmount = this.paymentMaxAmount
    e.paymentDailyLimit = this.paymentDailyLimit
    e.paymentOrderTimeoutMinutes = this.paymentOrderTimeoutMinutes
    e.paymentMaxPendingOrders = this.paymentMaxPendingOrders
    e.paymentEnabledTypes = this.paymentEnabledTypes
    e.paymentBalanceDisabled = this.paymentBalanceDisabled
    e.paymentBalanceRechargeMultiplier = this.paymentBalanceRechargeMultiplier
    e.paymentSubscriptionUsdToCnyRate = this.paymentSubscriptionUsdToCnyRate
    e.paymentRechargeFeeRate = this.paymentRechargeFeeRate
    e.paymentLoadBalanceStrategy = this.paymentLoadBalanceStrategy
    e.paymentProductNamePrefix = this.paymentProductNamePrefix
    e.paymentProductNameSuffix = this.paymentProductNameSuffix
    e.paymentHelpImageUrl = this.paymentHelpImageUrl
    e.paymentHelpText = this.paymentHelpText
    e.paymentCancelRateLimitEnabled = this.paymentCancelRateLimitEnabled
    e.paymentCancelRateLimitMax = this.paymentCancelRateLimitMax
    e.paymentCancelRateLimitWindow = this.paymentCancelRateLimitWindow
    e.paymentCancelRateLimitUnit = this.paymentCancelRateLimitUnit
    e.paymentCancelRateLimitWindowMode = this.paymentCancelRateLimitWindowMode
    e.paymentAlipayForceQrcode = this.paymentAlipayForceQrcode
    e.paymentVisibleMethodAlipaySource = this.paymentVisibleMethodAlipaySource
    e.paymentVisibleMethodWxpaySource = this.paymentVisibleMethodWxpaySource
    e.paymentVisibleMethodAlipayEnabled = this.paymentVisibleMethodAlipayEnabled
    e.paymentVisibleMethodWxpayEnabled = this.paymentVisibleMethodWxpayEnabled
    e.openaiLowUpstreamRatePriorityEnabled = this.openaiLowUpstreamRatePriorityEnabled
    e.openaiOauthSchedulingRateMultiplier = this.openaiOauthSchedulingRateMultiplier
    e.openaiAdvancedSchedulerEnabled = this.openaiAdvancedSchedulerEnabled
    e.openaiAdvancedSchedulerStickyWeightedEnabled = this.openaiAdvancedSchedulerStickyWeightedEnabled
    e.openaiAdvancedSchedulerSubscriptionPriorityEnabled = this.openaiAdvancedSchedulerSubscriptionPriorityEnabled
    e.openaiAdvancedSchedulerLbTopK = this.openaiAdvancedSchedulerLbTopK
    e.openaiAdvancedSchedulerWeightPriority = this.openaiAdvancedSchedulerWeightPriority
    e.openaiAdvancedSchedulerWeightLoad = this.openaiAdvancedSchedulerWeightLoad
    e.openaiAdvancedSchedulerWeightQueue = this.openaiAdvancedSchedulerWeightQueue
    e.openaiAdvancedSchedulerWeightErrorRate = this.openaiAdvancedSchedulerWeightErrorRate
    e.openaiAdvancedSchedulerWeightTtft = this.openaiAdvancedSchedulerWeightTtft
    e.openaiAdvancedSchedulerWeightReset = this.openaiAdvancedSchedulerWeightReset
    e.openaiAdvancedSchedulerWeightQuotaHeadroom = this.openaiAdvancedSchedulerWeightQuotaHeadroom
    e.openaiAdvancedSchedulerWeightUpstreamCost = this.openaiAdvancedSchedulerWeightUpstreamCost
    e.openaiAdvancedSchedulerWeightPreviousResponse = this.openaiAdvancedSchedulerWeightPreviousResponse
    e.openaiAdvancedSchedulerWeightSessionSticky = this.openaiAdvancedSchedulerWeightSessionSticky
    e.openaiAdvancedSchedulerEffectiveLbTopK = this.openaiAdvancedSchedulerEffectiveLbTopK
    e.openaiAdvancedSchedulerEffectiveWeightPriority = this.openaiAdvancedSchedulerEffectiveWeightPriority
    e.openaiAdvancedSchedulerEffectiveWeightLoad = this.openaiAdvancedSchedulerEffectiveWeightLoad
    e.openaiAdvancedSchedulerEffectiveWeightQueue = this.openaiAdvancedSchedulerEffectiveWeightQueue
    e.openaiAdvancedSchedulerEffectiveWeightErrorRate = this.openaiAdvancedSchedulerEffectiveWeightErrorRate
    e.openaiAdvancedSchedulerEffectiveWeightTtft = this.openaiAdvancedSchedulerEffectiveWeightTtft
    e.openaiAdvancedSchedulerEffectiveWeightReset = this.openaiAdvancedSchedulerEffectiveWeightReset
    e.openaiAdvancedSchedulerEffectiveWeightQuotaHeadroom = this.openaiAdvancedSchedulerEffectiveWeightQuotaHeadroom
    e.openaiAdvancedSchedulerEffectiveWeightUpstreamCost = this.openaiAdvancedSchedulerEffectiveWeightUpstreamCost
    e.openaiAdvancedSchedulerEffectiveWeightPreviousResponse = this.openaiAdvancedSchedulerEffectiveWeightPreviousResponse
    e.openaiAdvancedSchedulerEffectiveWeightSessionSticky = this.openaiAdvancedSchedulerEffectiveWeightSessionSticky
    e.balanceLowNotifyEnabled = this.balanceLowNotifyEnabled
    e.balanceLowNotifyThreshold = this.balanceLowNotifyThreshold
    e.balanceLowNotifyRechargeUrl = this.balanceLowNotifyRechargeUrl
    e.subscriptionExpiryNotifyEnabled = this.subscriptionExpiryNotifyEnabled
    e.accountQuotaNotifyEnabled = this.accountQuotaNotifyEnabled
    e.accountQuotaNotifyEmails = this.accountQuotaNotifyEmails as SystemSettings['accountQuotaNotifyEmails']
    e.channelMonitorEnabled = this.channelMonitorEnabled
    e.channelMonitorDefaultIntervalSeconds = this.channelMonitorDefaultIntervalSeconds
    e.availableChannelsEnabled = this.availableChannelsEnabled
    e.affiliateEnabled = this.affiliateEnabled
    e.openaiAdvancedFastPolicySettings = this.openaiAdvancedFastPolicySettings as SystemSettings['openaiAdvancedFastPolicySettings']
    e.allowUserViewErrorRequests = this.allowUserViewErrorRequests
    e.allowUserViewUsageDetails = this.allowUserViewUsageDetails
    return e
  }
}
