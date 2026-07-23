import type { CustomEndpoint, CustomMenuItem } from '@/types'
import type { LoginAgreementDocument, NotifyEmailEntry } from '@/features/auth/domain/models/auth'
export type PlatformType = 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok'
export type QuotaWindowType = 'daily' | 'weekly' | 'monthly'
export type ClientIpResolutionMode = 'auto_compat' | 'trusted_proxy' | 'direct'
export type AuthSourceType = 'email' | 'linuxdo' | 'oidc' | 'wechat' | 'github' | 'google' | 'dingtalk'
export type ThinkingDisplayMode = 'off' | 'display_only' | 'force'
export type AdminApiKeyScope =
  | 'admin.read' | 'admin.write' | 'admin.users.read' | 'admin.users.write'
  | 'admin.accounts.read' | 'admin.accounts.write' | 'admin.settings.read' | 'admin.settings.write'
  | 'admin.backups.read' | 'admin.backups.write' | 'admin.system.read' | 'admin.system.write'
  | 'admin.audit.read' | 'admin.audit.write' | 'admin.ops.read' | 'admin.ops.write'

export interface PlatformQuotaLimits { daily: number | null; weekly: number | null; monthly: number | null }
export type DefaultPlatformQuotasMap = Partial<Record<PlatformType, PlatformQuotaLimits>>

export interface DefaultSubscriptionSetting { groupId: number; validityDays: number }

export interface ClientIpResolutionStatus {
  mode: ClientIpResolutionMode
  customPrefixCount: number
  staticPrefixCount: number
  cloudflarePrefixCount: number
  cloudflareRangesSource: 'embedded' | 'refreshed'
  cloudflareLastSuccessAt: string | null
}

export interface OverloadCooldownSettings { enabled: boolean; cooldownMinutes: number }
export interface RateLimit429CooldownSettings { enabled: boolean; cooldownSeconds: number }
export interface GlobalTempUnschedulableSettings { enabled: boolean }

export interface StreamTimeoutSettings {
  enabled: boolean
  action: 'temp_unsched' | 'error' | 'none'
  tempUnschedMinutes: number
  thresholdCount: number
  thresholdWindowMinutes: number
}

export interface RectifierSettings {
  enabled: boolean
  thinkingSignatureEnabled: boolean
  thinkingBudgetEnabled: boolean
  thinkingDisplayMode: ThinkingDisplayMode
  apikeySignatureEnabled: boolean
  apikeySignaturePatterns: string[]
}

export interface OpenAIFastPolicyRule {
  serviceTier: 'all' | 'priority' | 'flex'
  action: 'pass' | 'filter' | 'block' | 'force_priority'
  scope: 'all' | 'oauth' | 'apikey' | 'bedrock'
  userIds?: number[]
  errorMessage?: string
  modelWhitelist?: string[]
  fallbackAction?: 'pass' | 'filter' | 'block' | 'force_priority'
  fallbackErrorMessage?: string
}

export interface OpenAIFastPolicySettings { rules: OpenAIFastPolicyRule[] }

export interface BetaPolicyRule {
  betaToken: string
  action: 'pass' | 'filter' | 'block'
  scope: 'all' | 'oauth' | 'apikey' | 'bedrock'
  errorMessage?: string
  modelWhitelist?: string[]
  fallbackAction?: 'pass' | 'filter' | 'block'
  fallbackErrorMessage?: string
}

export interface BetaPolicySettings { rules: BetaPolicyRule[] }

export interface WebSearchProviderConfig {
  type: 'brave' | 'tavily'
  apiKey: string
  apiKeyConfigured: boolean
  quotaLimit: number | null
  subscribedAt: number | null
  quotaUsed?: number
  proxyId: number | null
  expiresAt: number | null
}

export interface WebSearchEmulationConfig {
  enabled: boolean
  providers: WebSearchProviderConfig[]
}

export interface AdminApiKey {
  id: string
  name: string
  keyPrefix: string
  lastFour: string
  scopes: AdminApiKeyScope[]
  status: 'active' | 'revoked' | string
  expiresAt?: string | null
  createdBy: number
  lastUsedAt?: string | null
  createdAt: string
  updatedAt: string
  revokedAt?: string | null
}

export interface EmailTemplateSummary {
  event: string
  locale: string
  subject: string
  isCustom?: boolean
  updatedAt?: string
}

export interface EmailTemplateDetail {
  event: string
  locale: string
  subject: string
  html: string
  isCustom?: boolean
  updatedAt?: string
  placeholders?: string[]
}

export interface AuthSourceDefaultsValue {
  balance: number
  concurrency: number
  subscriptions: DefaultSubscriptionSetting[]
  grantOnSignup: boolean
  grantOnFirstBind: boolean
  platformQuotas: DefaultPlatformQuotasMap
}

export type AuthSourceDefaultsState = Record<AuthSourceType, AuthSourceDefaultsValue>

export interface SystemSettings {
  // Registration
  registrationEnabled: boolean
  emailVerifyEnabled: boolean
  registrationEmailSuffixWhitelist: string[]
  promoCodeEnabled: boolean
  passwordResetEnabled: boolean
  frontendUrl: string
  invitationCodeEnabled: boolean
  totpEnabled: boolean
  totpEncryptionKeyConfigured: boolean
  sessionBindingEnabled: boolean
  stepUpEnabled: boolean
  auditLogRetentionDays: number
  loginAgreementEnabled: boolean
  loginAgreementMode: 'modal' | 'checkbox' | string
  loginAgreementUpdatedAt: string
  loginAgreementDocuments: LoginAgreementDocument[]
  // Defaults
  defaultBalance: number
  affiliateRebateRate: number
  affiliateRebateFreezeHours: number
  affiliateRebateDurationDays: number
  affiliateRebatePerInviteeCap: number
  affiliateAdminRechargeEnabled: boolean
  defaultConcurrency: number
  defaultUserRpmLimit: number
  defaultSubscriptions: DefaultSubscriptionSetting[]
  defaultPlatformQuotas?: DefaultPlatformQuotasMap
  // OEM
  siteName: string
  siteLogo: string
  siteSubtitle: string
  apiBaseUrl: string
  contactInfo: string
  docUrl: string
  homeContent: string
  hideCcsImportButton: boolean
  tableDefaultPageSize: number
  tablePageSizeOptions: number[]
  backendModeEnabled: boolean
  streamModePerformanceEnabled: boolean
  customMenuItems: CustomMenuItem[]
  customEndpoints: CustomEndpoint[]
  // SMTP
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPasswordConfigured: boolean
  smtpFromEmail: string
  smtpFromName: string
  smtpUseTls: boolean
  // Captcha
  turnstileEnabled: boolean
  turnstileSiteKey: string
  turnstileSecretKeyConfigured: boolean
  recaptchaEnabled: boolean
  recaptchaSiteKey: string
  recaptchaSecretKeyConfigured: boolean
  capEnabled: boolean
  capApiEndpoint: string
  capSecretKeyConfigured: boolean
  localCaptchaEnabled: boolean
  apiKeyAclTrustForwardedIp: boolean
  clientIpResolutionMode: ClientIpResolutionMode
  clientIpTrustedProxies: string[]
  clientIpResolutionStatus: ClientIpResolutionStatus
  // OAuth providers
  linuxdoConnectEnabled: boolean
  linuxdoConnectClientId: string
  linuxdoConnectClientSecretConfigured: boolean
  linuxdoConnectRedirectUrl: string
  dingtalkConnectEnabled: boolean
  dingtalkConnectClientId: string
  dingtalkConnectClientSecretConfigured: boolean
  dingtalkConnectRedirectUrl: string
  dingtalkConnectCorpRestrictionPolicy: string
  dingtalkConnectInternalCorpId: string
  dingtalkConnectBypassRegistration: boolean
  dingtalkConnectSyncCorpEmail: boolean
  dingtalkConnectSyncDisplayName: boolean
  dingtalkConnectSyncDept: boolean
  dingtalkConnectSyncCorpEmailAttrKey: string
  dingtalkConnectSyncDisplayNameAttrKey: string
  dingtalkConnectSyncDeptAttrKey: string
  dingtalkConnectSyncCorpEmailAttrName: string
  dingtalkConnectSyncDisplayNameAttrName: string
  dingtalkConnectSyncDeptAttrName: string
  wechatConnectEnabled: boolean
  wechatConnectAppId: string
  wechatConnectAppSecretConfigured: boolean
  wechatConnectOpenAppId?: string
  wechatConnectOpenAppSecretConfigured?: boolean
  wechatConnectMpAppId?: string
  wechatConnectMpAppSecretConfigured?: boolean
  wechatConnectMobileAppId?: string
  wechatConnectMobileAppSecretConfigured?: boolean
  wechatConnectOpenEnabled?: boolean
  wechatConnectMpEnabled?: boolean
  wechatConnectMobileEnabled?: boolean
  wechatConnectMode: string
  wechatConnectScopes: string
  wechatConnectRedirectUrl: string
  wechatConnectFrontendRedirectUrl: string
  oidcConnectEnabled: boolean
  oidcConnectProviderName: string
  oidcConnectClientId: string
  oidcConnectClientSecretConfigured: boolean
  oidcConnectIssuerUrl: string
  oidcConnectDiscoveryUrl: string
  oidcConnectAuthorizeUrl: string
  oidcConnectTokenUrl: string
  oidcConnectUserinfoUrl: string
  oidcConnectJwksUrl: string
  oidcConnectScopes: string
  oidcConnectRedirectUrl: string
  oidcConnectFrontendRedirectUrl: string
  oidcConnectTokenAuthMethod: string
  oidcConnectUsePkce: boolean
  oidcConnectValidateIdToken: boolean
  oidcConnectAllowedSigningAlgs: string
  oidcConnectClockSkewSeconds: number
  oidcConnectRequireEmailVerified: boolean
  oidcConnectUserinfoEmailPath: string
  oidcConnectUserinfoIdPath: string
  oidcConnectUserinfoUsernamePath: string
  githubOauthEnabled: boolean
  githubOauthClientId: string
  githubOauthClientSecretConfigured: boolean
  githubOauthRedirectUrl: string
  githubOauthFrontendRedirectUrl: string
  googleOauthEnabled: boolean
  googleOauthClientId: string
  googleOauthClientSecretConfigured: boolean
  googleOauthRedirectUrl: string
  googleOauthFrontendRedirectUrl: string
  // Model fallback
  enableModelFallback: boolean
  fallbackModelAnthropic: string
  fallbackModelOpenai: string
  fallbackModelGemini: string
  fallbackModelAntigravity: string
  // Identity patch
  enableIdentityPatch: boolean
  identityPatchPrompt: string
  // Ops monitoring
  opsMonitoringEnabled: boolean
  opsRealtimeMonitoringEnabled: boolean
  opsQueryModeDefault: 'auto' | 'raw' | 'preagg' | string
  opsMetricsIntervalSeconds: number
  // Claude Code version
  minClaudeCodeVersion: string
  maxClaudeCodeVersion: string
  // Scheduler
  allowUngroupedKeyScheduling: boolean
  schedulerV2Enabled: boolean
  schedulerV2Status: string
  schedulerV2Error: string
  schedulerV2CandidateLimit: number
  schedulerV2ScanLimit: number
  // Gateway
  enableFingerprintUnification: boolean
  enableMetadataPassthrough: boolean
  enableCchSigning: boolean
  enableClaudeOauthSystemPromptInjection: boolean
  claudeOauthSystemPrompt: string
  claudeOauthSystemPromptBlocks: string
  enableAnthropicCacheTtl1hInjection: boolean
  rewriteMessageCacheControl: boolean
  enableClientDatelineNormalization: boolean
  antigravityUserAgentVersion: string
  openaiCodexUserAgent: string
  minCodexVersion: string
  maxCodexVersion: string
  codexCliOnlyBlacklist: string
  codexCliOnlyWhitelist: string
  codexCliOnlyAllowAppServerClients: boolean
  codexCliOnlyEngineFingerprintSignals: string
  webSearchEmulationEnabled?: boolean
  // Payment
  paymentEnabled: boolean
  riskControlEnabled: boolean
  cyberSessionBlockEnabled: boolean
  cyberSessionBlockTtlSeconds: number
  paymentMinAmount: number
  paymentMaxAmount: number
  paymentDailyLimit: number
  paymentOrderTimeoutMinutes: number
  paymentMaxPendingOrders: number
  paymentEnabledTypes: string[]
  paymentBalanceDisabled: boolean
  paymentBalanceRechargeMultiplier: number
  paymentSubscriptionUsdToCnyRate: number
  paymentRechargeFeeRate: number
  paymentLoadBalanceStrategy: string
  paymentProductNamePrefix: string
  paymentProductNameSuffix: string
  paymentHelpImageUrl: string
  paymentHelpText: string
  paymentCancelRateLimitEnabled: boolean
  paymentCancelRateLimitMax: number
  paymentCancelRateLimitWindow: number
  paymentCancelRateLimitUnit: string
  paymentCancelRateLimitWindowMode: string
  paymentAlipayForceQrcode?: boolean
  paymentVisibleMethodAlipaySource?: string
  paymentVisibleMethodWxpaySource?: string
  paymentVisibleMethodAlipayEnabled?: boolean
  paymentVisibleMethodWxpayEnabled?: boolean
  // OpenAI scheduling
  openaiLowUpstreamRatePriorityEnabled?: boolean
  openaiOauthSchedulingRateMultiplier?: number
  openaiAdvancedSchedulerEnabled?: boolean
  openaiAdvancedSchedulerStickyWeightedEnabled?: boolean
  openaiAdvancedSchedulerSubscriptionPriorityEnabled?: boolean
  openaiAdvancedSchedulerLbTopK?: string
  openaiAdvancedSchedulerWeightPriority?: string
  openaiAdvancedSchedulerWeightLoad?: string
  openaiAdvancedSchedulerWeightQueue?: string
  openaiAdvancedSchedulerWeightErrorRate?: string
  openaiAdvancedSchedulerWeightTtft?: string
  openaiAdvancedSchedulerWeightReset?: string
  openaiAdvancedSchedulerWeightQuotaHeadroom?: string
  openaiAdvancedSchedulerWeightUpstreamCost?: string
  openaiAdvancedSchedulerWeightPreviousResponse?: string
  openaiAdvancedSchedulerWeightSessionSticky?: string
  openaiAdvancedSchedulerEffectiveLbTopK?: string
  openaiAdvancedSchedulerEffectiveWeightPriority?: string
  openaiAdvancedSchedulerEffectiveWeightLoad?: string
  openaiAdvancedSchedulerEffectiveWeightQueue?: string
  openaiAdvancedSchedulerEffectiveWeightErrorRate?: string
  openaiAdvancedSchedulerEffectiveWeightTtft?: string
  openaiAdvancedSchedulerEffectiveWeightReset?: string
  openaiAdvancedSchedulerEffectiveWeightQuotaHeadroom?: string
  openaiAdvancedSchedulerEffectiveWeightUpstreamCost?: string
  openaiAdvancedSchedulerEffectiveWeightPreviousResponse?: string
  openaiAdvancedSchedulerEffectiveWeightSessionSticky?: string
  // Notifications
  balanceLowNotifyEnabled: boolean
  balanceLowNotifyThreshold: number
  balanceLowNotifyRechargeUrl: string
  subscriptionExpiryNotifyEnabled: boolean
  accountQuotaNotifyEnabled: boolean
  accountQuotaNotifyEmails: NotifyEmailEntry[]
  // Feature switches
  channelMonitorEnabled: boolean
  channelMonitorDefaultIntervalSeconds: number
  availableChannelsEnabled: boolean
  affiliateEnabled: boolean
  openaiAdvancedFastPolicySettings?: OpenAIFastPolicySettings
  allowUserViewErrorRequests: boolean
  allowUserViewUsageDetails: boolean
}
