/**
 * Core Type Definitions for Sub2API Frontend
 */

// ==================== Common Types ====================

export interface SelectOption {
  value: string | number | boolean | null
  label: string
  [key: string]: any // Support extra properties for custom templates
}

export interface BasePaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}

export interface FetchOptions {
  signal?: AbortSignal
}

// ==================== Notification Types ====================

/** Notification email entry with enable/disable and verification state.
 *  email="" is a placeholder for the primary email (user's registration email or admin email). */
export interface NotifyEmailEntry {
  email: string
  disabled: boolean
  verified: boolean
}

// ==================== User & Auth Types ====================

export type UserAuthProvider = 'email' | 'linuxdo' | 'oidc' | 'wechat' | 'github' | 'google' | 'dingtalk'

export interface UserAuthBindingStatus {
  bound?: boolean
  boundCount?: number
  provider?: UserAuthProvider | string
  providerKey?: string | null
  providerSubject?: string | null
  issuer?: string | null
  label?: string | null
  providerLabel?: string | null
  displayName?: string | null
  subjectHint?: string | null
  verifiedAt?: string | null
  bindStartPath?: string | null
  canBind?: boolean
  canUnbind?: boolean
  noteKey?: string | null
  note?: string | null
  metadata?: Record<string, unknown>
}

export interface UserProfileSourceContext {
  provider?: UserAuthProvider | string
  source?: string | null
  label?: string | null
  providerLabel?: string | null
}

export interface User {
  id: number
  username: string
  email: string
  avatarUrl?: string | null
  avatarSource?: string | UserProfileSourceContext | null
  usernameSource?: string | UserProfileSourceContext | null
  displayNameSource?: string | UserProfileSourceContext | null
  nicknameSource?: string | UserProfileSourceContext | null
  profileSources?: {
    avatar?: string | UserProfileSourceContext | null
    username?: string | UserProfileSourceContext | null
    displayName?: string | UserProfileSourceContext | null
    nickname?: string | UserProfileSourceContext | null
  }
  authBindings?: Partial<Record<UserAuthProvider, boolean | UserAuthBindingStatus>>
  identityBindings?: Partial<Record<UserAuthProvider, boolean | UserAuthBindingStatus>>
  emailBound?: boolean
  linuxdoBound?: boolean
  oidcBound?: boolean
  wechatBound?: boolean
  role: 'admin' | 'user' // User role for authorization
  balance: number // User balance for API usage
  frozenBalance?: number // Balance currently held by async batch jobs
  concurrency: number // Allowed concurrent requests
  rpmLimit?: number // User-level RPM cap (0 = unlimited); effective as fallback when group has no rpm_limit
  status: 'active' | 'disabled' // Account status
  allowedGroups: number[] | null // Allowed group IDs (null = all non-exclusive groups)
  balanceNotifyEnabled: boolean
  balanceNotifyThreshold: number | null
  balanceNotifyExtraEmails: NotifyEmailEntry[]
  subscriptions?: UserSubscription[] // User's active subscriptions
  lastActiveAt?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface AdminUser extends User {
  // 管理员备注（普通用户接口不返回）
  notes: string
  lastUsedAt?: string | null
  // 用户专属分组倍率配置 (group_id -> rate_multiplier)
  groupRates?: Record<number, number>
  // 当前并发数（仅管理员列表接口返回）
  currentConcurrency?: number
}

export interface LoginRequest {
  email: string
  password: string
  turnstileToken?: string
  captchaToken?: string
  captchaId?: string
  captchaCode?: string
}

export interface CredentialEnvelope {
  algorithm: 'RSA-OAEP-256+A256GCM'
  keyId: string
  encryptedKey: string
  iv: string
  ciphertext: string
}

export interface RegisterRequest {
  email: string
  password: string
  verifyCode?: string
  turnstileToken?: string
  captchaToken?: string
  captchaId?: string
  captchaCode?: string
  promoCode?: string
  invitationCode?: string
  affCode?: string
}

export interface EncryptedRegisterRequest extends Omit<RegisterRequest, 'email' | 'password'> {
  credentialEnvelope: CredentialEnvelope
}

export interface AffiliateInvitee {
  userId: number
  email: string
  username: string
  createdAt?: string
  totalRebate: number
}

export interface UserAffiliateDetail {
  userId: number
  affCode: string
  inviterId?: number | null
  affCount: number
  affQuota: number
  affFrozenQuota: number
  affHistoryQuota: number
  /** 当前用户作为邀请人时实际生效的返利比例（专属覆盖全局）。0-100。 */
  effectiveRebateRatePercent: number
  invitees: AffiliateInvitee[]
}

export interface AffiliateTransferResponse {
  transferredQuota: number
  balance: number
}

export interface SendVerifyCodeRequest {
  email: string
  turnstileToken?: string
  captchaToken?: string
  captchaId?: string
  captchaCode?: string
  pendingAuthToken?: string
  pendingOauthToken?: string
}

export interface SendVerifyCodeResponse {
  message: string
  countdown: number
}

export interface CustomMenuItem {
  id: string
  label: string
  iconSvg: string
  url: string
  pageSlug?: string
  visibility: 'user' | 'admin'
  sortOrder: number
}

export interface CustomEndpoint {
  name: string
  endpoint: string
  description: string
}

export interface LoginAgreementDocument {
  id: string
  title: string
  contentMd: string
}

export interface PublicSettings {
  registrationEnabled: boolean
  emailVerifyEnabled: boolean
  forceEmailOnThirdPartySignup: boolean
  registrationEmailSuffixWhitelist: string[]
  promoCodeEnabled: boolean
  passwordResetEnabled: boolean
  invitationCodeEnabled: boolean
  loginAgreementEnabled?: boolean
  loginAgreementMode?: 'modal' | 'checkbox' | string
  loginAgreementUpdatedAt?: string
  loginAgreementRevision?: string
  loginAgreementDocuments?: LoginAgreementDocument[]
  turnstileEnabled: boolean
  turnstileSiteKey: string
  recaptchaEnabled: boolean
  recaptchaSiteKey: string
  capEnabled: boolean
  capApiEndpoint: string
  localCaptchaEnabled?: boolean
  siteName: string
  siteLogo: string
  siteSubtitle: string
  apiBaseUrl: string
  contactInfo: string
  docUrl: string
  homeContent: string
  hideCcsImportButton: boolean
  paymentEnabled: boolean
  riskControlEnabled: boolean
  tableDefaultPageSize: number
  tablePageSizeOptions: number[]
  customMenuItems: CustomMenuItem[]
  customEndpoints: CustomEndpoint[]
  linuxdoOauthEnabled: boolean
  dingtalkOauthEnabled?: boolean
  wechatOauthEnabled: boolean
  wechatOauthOpenEnabled?: boolean
  wechatOauthMpEnabled?: boolean
  wechatOauthMobileEnabled?: boolean
  oidcOauthEnabled: boolean
  oidcOauthProviderName: string
  githubOauthEnabled: boolean
  googleOauthEnabled: boolean
  backendModeEnabled: boolean
  version: string
  // 服务器全局时区（IANA 名称与当前 UTC 偏移），高峰时段等服务端本地时间窗口的展示标注用；
  // 可选：注入的 __APP_CONFIG__ 旧缓存可能缺失
  serverTimezone?: string
  serverUtcOffset?: string
  balanceLowNotifyEnabled: boolean
  accountQuotaNotifyEnabled: boolean
  balanceLowNotifyThreshold: number
  channelMonitorEnabled: boolean
  channelMonitorDefaultIntervalSeconds: number
  availableChannelsEnabled: boolean
  serviceQuotaEnabled: boolean
  affiliateEnabled: boolean
  allowUserViewErrorRequests?: boolean
  allowUserViewUsageDetails?: boolean
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string  // New: Refresh Token for token renewal
  expiresIn?: number     // New: Access Token expiry time in seconds
  tokenType: string
  user: User & { run_mode?: 'standard' | 'simple' }
}

export interface CurrentUserResponse extends User {
  runMode?: 'standard' | 'simple'
}

// ==================== Subscription Types ====================

export interface Subscription {
  id: number
  userId: number
  name: string
  url: string
  type: 'clash' | 'v2ray' | 'surge' | 'quantumult' | 'shadowrocket'
  updateInterval: number // in hours
  lastUpdated: string | null
  nodeCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionRequest {
  name: string
  url: string
  type: Subscription['type']
  updateInterval?: number
}

export interface UpdateSubscriptionRequest {
  name?: string
  url?: string
  type?: Subscription['type']
  updateInterval?: number
  isActive?: boolean
}

// ==================== Announcement Types ====================

export type AnnouncementStatus = 'draft' | 'active' | 'archived'
export type AnnouncementNotifyMode = 'silent' | 'popup'

export type AnnouncementConditionType = 'subscription' | 'balance'

export type AnnouncementOperator = 'in' | 'gt' | 'gte' | 'lt' | 'lte' | 'eq'

export interface AnnouncementCondition {
  type: AnnouncementConditionType
  operator: AnnouncementOperator
  groupIds?: number[]
  value?: number
}

export interface AnnouncementConditionGroup {
  allOf?: AnnouncementCondition[]
}

export interface AnnouncementTargeting {
  anyOf?: AnnouncementConditionGroup[]
}

export interface Announcement {
  id: number
  title: string
  content: string
  status: AnnouncementStatus
  notifyMode: AnnouncementNotifyMode
  targeting: AnnouncementTargeting
  startsAt?: string
  endsAt?: string
  createdBy?: number
  updatedBy?: number
  createdAt: string
  updatedAt: string
}

export interface UserAnnouncement {
  id: number
  title: string
  content: string
  notifyMode: AnnouncementNotifyMode
  startsAt?: string
  endsAt?: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  status?: AnnouncementStatus
  notifyMode?: AnnouncementNotifyMode
  targeting: AnnouncementTargeting
  startsAt?: number
  endsAt?: number
}

export interface UpdateAnnouncementRequest {
  title?: string
  content?: string
  status?: AnnouncementStatus
  notifyMode?: AnnouncementNotifyMode
  targeting?: AnnouncementTargeting
  startsAt?: number
  endsAt?: number
}

export interface AnnouncementUserReadStatus {
  userId: number
  email: string
  username: string
  balance: number
  eligible: boolean
  readAt?: string
}

// ==================== Proxy Node Types ====================

export interface ProxyNode {
  id: number
  subscriptionId: number
  name: string
  type: 'ss' | 'ssr' | 'vmess' | 'vless' | 'trojan' | 'hysteria' | 'hysteria2'
  server: string
  port: number
  config: Record<string, unknown> // JSON configuration specific to proxy type
  latency: number | null // in milliseconds
  lastChecked: string | null
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

// ==================== Conversion Types ====================

export interface ConversionRequest {
  subscriptionIds: number[]
  targetType: 'clash' | 'v2ray' | 'surge' | 'quantumult' | 'shadowrocket'
  filter?: {
    namePattern?: string
    types?: ProxyNode['type'][]
    minLatency?: number
    maxLatency?: number
    availableOnly?: boolean
  }
  sort?: {
    by: 'name' | 'latency' | 'type'
    order: 'asc' | 'desc'
  }
}

export interface ConversionResult {
  url: string // URL to download the converted subscription
  expiresAt: string
  nodeCount: number
}

// ==================== Statistics Types ====================

export interface SubscriptionStats {
  subscriptionId: number
  totalNodes: number
  availableNodes: number
  avgLatency: number | null
  byType: Record<ProxyNode['type'], number>
  lastUpdate: string
}

export interface UserStats {
  totalSubscriptions: number
  totalNodes: number
  activeSubscriptions: number
  totalConversions: number
  lastConversion: string | null
}

// ==================== API Response Types ====================

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface ApiError {
  detail: string
  code?: string
  field?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}

// ==================== UI State Types ====================

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  title?: string
  duration?: number // in milliseconds, undefined means no auto-dismiss
  startTime?: number // timestamp when toast was created, for progress bar
}

export interface AppState {
  sidebarCollapsed: boolean
  loading: boolean
  toasts: Toast[]
}

// ==================== Validation Types ====================

export interface ValidationError {
  field: string
  message: string
}

// ==================== Table/List Types ====================

export interface SortConfig {
  key: string
  order: 'asc' | 'desc'
}

export interface FilterConfig {
  [key: string]: string | number | boolean | null | undefined
}

export interface PaginationConfig {
  page: number
  pageSize: number
}

// ==================== API Key & Group Types ====================

export type GroupPlatform = 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok' | 'composite'

export type SubscriptionType = 'standard' | 'subscription'

export interface OpenAIMessagesDispatchModelConfig {
  opusMappedModel?: string
  sonnetMappedModel?: string
  haikuMappedModel?: string
  exactModelMappings?: Record<string, string>
}

export interface Group {
  id: number
  name: string
  description: string | null
  platform: GroupPlatform
  rateMultiplier: number
  rpmLimit?: number // Group-level RPM cap (0 = unlimited); overrides user-level rpm_limit when set
  isExclusive: boolean
  status: 'active' | 'inactive'
  subscriptionType: SubscriptionType
  dailyLimitUsd: number | null
  weeklyLimitUsd: number | null
  monthlyLimitUsd: number | null
  // 图片生成计费配置
  allowImageGeneration: boolean
  openaiForceImageTool: boolean
  allowBatchImageGeneration: boolean
  imageRateIndependent: boolean
  imageRateMultiplier: number
  batchImageDiscountMultiplier: number
  batchImageHoldMultiplier: number
  imagePrice1k: number | null
  imagePrice2k: number | null
  imagePrice4k: number | null
  videoRateIndependent: boolean
  videoRateMultiplier: number
  videoPrice480p: number | null
  videoPrice720p: number | null
  videoPrice1080p: number | null
  // Codex 网页搜索单次价格（USD/次）；null 表示使用默认价 0.01
  webSearchPricePerCall: number | null
  // 高峰时段倍率配置
  peakRateEnabled: boolean
  peakStart: string
  peakEnd: string
  peakRateMultiplier: number
  // Claude Code 客户端限制
  claudeCodeOnly: boolean
  fallbackGroupId: number | null
  fallbackGroupIdOnInvalidRequest: number | null
  // OpenAI Messages 调度开关（用户侧需要此字段判断是否展示 Claude Code 教程）
  allowMessagesDispatch?: boolean
  defaultMappedModel?: string
  messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfig
  requireOauthOnly: boolean
  requirePrivacySet: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminGroup extends Group {
  // 模型路由配置（仅管理员可见，内部信息）
  modelRouting: Record<string, number[]> | null
  modelRoutingEnabled: boolean

  // MCP XML 协议注入（仅 antigravity 平台使用）
  mcpXmlInject: boolean

  // 支持的模型系列（仅 antigravity 平台使用）
  supportedModelScopes?: string[]

  // 分组下账号数量（仅管理员可见）
  accountCount?: number
  activeAccountCount?: number
  rateLimitedAccountCount?: number

  // OpenAI Messages 调度配置（仅 openai 平台使用）
  defaultMappedModel?: string
  messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfig
  modelsListConfig?: ModelsListConfig

  // 分组排序
  sortOrder: number
}

export interface ModelsListConfig {
  enabled: boolean
  models: string[]
}

export type CompositeRouteMatchType = 'exact' | 'prefix'

export type CompositeRouteEndpoint =
  | 'any'
  | 'messages'
  | 'count_tokens'
  | 'responses'
  | 'chat_completions'
  | 'embeddings'
  | 'images'
  | 'gemini'

export type CompositeRouteSource = 'route' | 'detector' | string

export interface CompositeModelRoute {
  id: number
  groupId: number
  publicModel: string
  matchType: CompositeRouteMatchType
  targetPlatform: Exclude<GroupPlatform, 'composite'>
  upstreamModel: string
  endpoint: CompositeRouteEndpoint
  priority: number
  enabled: boolean
  notes: string
  createdAt?: string
  updatedAt?: string
}

export interface CompositeModelRouteInput {
  publicModel: string
  matchType: CompositeRouteMatchType
  targetPlatform: Exclude<GroupPlatform, 'composite'>
  upstreamModel?: string
  endpoint: CompositeRouteEndpoint
  priority?: number
  enabled?: boolean
  notes?: string
}

export interface CompositeRoutePreviewRequest {
  model: string
  endpoint: CompositeRouteEndpoint
}

export interface CompositeRouteDecision {
  matched: boolean
  source: CompositeRouteSource
  groupId: number
  publicModel: string
  targetPlatform: Exclude<GroupPlatform, 'composite'> | ''
  upstreamModel: string
  endpoint: CompositeRouteEndpoint
  route?: CompositeModelRoute
  reason?: string
}

export interface ApiKey {
  id: number
  userId: number
  key: string
  name: string
  groupId: number | null
  status: 'active' | 'inactive' | 'quota_exhausted' | 'expired'
  ipWhitelist: string[]
  ipBlacklist: string[]
  lastUsedAt: string | null
  lastUsedIp: string | null
  quota: number // Quota limit in USD (0 = unlimited)
  quotaUsed: number // Used quota amount in USD
  expiresAt: string | null // Expiration time (null = never expires)
  createdAt: string
  updatedAt: string
  concurrencyLimit: number // Maximum concurrent requests (0 = unlimited)
  currentConcurrency: number
  group?: Group
  rateLimit5h: number
  rateLimit1d: number
  rateLimit7d: number
  usage5h: number
  usage1d: number
  usage7d: number
  window5hStart: string | null
  window1dStart: string | null
  window7dStart: string | null
  reset5hAt: string | null
  reset1dAt: string | null
  reset7dAt: string | null
}

export interface CreateApiKeyRequest {
  name: string
  groupId?: number | null
  customKey?: string // Optional custom API Key
  ipWhitelist?: string[]
  ipBlacklist?: string[]
  quota?: number // Quota limit in USD (0 = unlimited)
  expiresInDays?: number // Days until expiry (null = never expires)
  rateLimit5h?: number
  rateLimit1d?: number
  rateLimit7d?: number
}

export interface UpdateApiKeyRequest {
  name?: string
  groupId?: number | null
  status?: 'active' | 'inactive'
  ipWhitelist?: string[]
  ipBlacklist?: string[]
  quota?: number // Quota limit in USD (null = no change, 0 = unlimited)
  expiresAt?: string | null // Expiration time (null = no change)
  resetQuota?: boolean // Reset quota_used to 0
  concurrencyLimit?: number // Maximum concurrent requests (0 = unlimited)
  rateLimit5h?: number
  rateLimit1d?: number
  rateLimit7d?: number
  resetRateLimitUsage?: boolean
}

export interface CreateGroupRequest {
  name: string
  description?: string | null
  platform?: GroupPlatform
  rateMultiplier?: number
  isExclusive?: boolean
  subscriptionType?: SubscriptionType
  dailyLimitUsd?: number | null
  weeklyLimitUsd?: number | null
  monthlyLimitUsd?: number | null
  allowImageGeneration?: boolean
  openaiForceImageTool?: boolean
  allowBatchImageGeneration?: boolean
  imageRateIndependent?: boolean
  imageRateMultiplier?: number
  batchImageDiscountMultiplier?: number
  batchImageHoldMultiplier?: number
  imagePrice1k?: number | null
  imagePrice2k?: number | null
  imagePrice4k?: number | null
  videoRateIndependent?: boolean
  videoRateMultiplier?: number
  videoPrice480p?: number | null
  videoPrice720p?: number | null
  videoPrice1080p?: number | null
  webSearchPricePerCall?: number | null
  peakRateEnabled?: boolean
  peakStart?: string
  peakEnd?: string
  peakRateMultiplier?: number
  claudeCodeOnly?: boolean
  fallbackGroupId?: number | null
  fallbackGroupIdOnInvalidRequest?: number | null
  mcpXmlInject?: boolean
  supportedModelScopes?: string[]
  modelsListConfig?: ModelsListConfig
  allowMessagesDispatch?: boolean
  defaultMappedModel?: string
  messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfig
  modelRouting?: Record<string, number[]> | null
  modelRoutingEnabled?: boolean
  rpmLimit?: number
  requireOauthOnly?: boolean
  requirePrivacySet?: boolean
  // 从指定分组复制账号
  copyAccountsFromGroupIds?: number[]
}

export interface UpdateGroupRequest {
  name?: string
  description?: string | null
  platform?: GroupPlatform
  rateMultiplier?: number
  isExclusive?: boolean
  status?: 'active' | 'inactive'
  subscriptionType?: SubscriptionType
  dailyLimitUsd?: number | null
  weeklyLimitUsd?: number | null
  monthlyLimitUsd?: number | null
  allowImageGeneration?: boolean
  openaiForceImageTool?: boolean
  allowBatchImageGeneration?: boolean
  imageRateIndependent?: boolean
  imageRateMultiplier?: number
  batchImageDiscountMultiplier?: number
  batchImageHoldMultiplier?: number
  imagePrice1k?: number | null
  imagePrice2k?: number | null
  imagePrice4k?: number | null
  videoRateIndependent?: boolean
  videoRateMultiplier?: number
  videoPrice480p?: number | null
  videoPrice720p?: number | null
  videoPrice1080p?: number | null
  webSearchPricePerCall?: number | null
  peakRateEnabled?: boolean
  peakStart?: string
  peakEnd?: string
  peakRateMultiplier?: number
  claudeCodeOnly?: boolean
  fallbackGroupId?: number | null
  fallbackGroupIdOnInvalidRequest?: number | null
  mcpXmlInject?: boolean
  supportedModelScopes?: string[]
  modelsListConfig?: ModelsListConfig
  allowMessagesDispatch?: boolean
  defaultMappedModel?: string
  messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfig
  modelRouting?: Record<string, number[]> | null
  modelRoutingEnabled?: boolean
  rpmLimit?: number
  requireOauthOnly?: boolean
  requirePrivacySet?: boolean
  copyAccountsFromGroupIds?: number[]
}

// ==================== Account & Proxy Types ====================

export type AccountPlatform = 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok'
export type AccountType = 'oauth' | 'setup-token' | 'apikey' | 'upstream' | 'bedrock' | 'service_account'
export type OAuthAddMethod = 'oauth' | 'setup-token'
export type ProxyProtocol = 'http' | 'https' | 'socks5' | 'socks5h'

// Claude Model type (returned by /v1/models and account models API)
export interface ClaudeModel {
  id: string
  type: string
  displayName: string
  createdAt: string
}

export interface Proxy {
  id: number
  name: string
  protocol: ProxyProtocol
  host: string
  port: number
  username: string | null
  password?: string | null
  status: 'active' | 'inactive' | 'expired'
  accountCount?: number // Number of accounts using this proxy
  latencyMs?: number
  latencyStatus?: 'success' | 'failed'
  latencyMessage?: string
  ipAddress?: string
  country?: string
  countryCode?: string
  region?: string
  city?: string
  qualityStatus?: 'healthy' | 'warn' | 'challenge' | 'failed'
  qualityScore?: number
  qualityGrade?: string
  qualitySummary?: string
  qualityChecked?: number
  expiresAt: string | null
  fallbackMode: 'none' | 'proxy' | 'direct'
  backupProxyId?: number | null
  expiryWarnDays: number
  createdAt: string
  updatedAt: string
}

export interface ProxyAccountSummary {
  id: number
  name: string
  platform: AccountPlatform
  type: AccountType
  notes?: string | null
}

export interface ProxyQualityCheckItem {
  target: string
  status: 'pass' | 'warn' | 'fail' | 'challenge'
  httpStatus?: number
  latencyMs?: number
  message?: string
  cfRay?: string
}

export interface ProxyQualityCheckResult {
  proxyId: number
  score: number
  grade: string
  summary: string
  exitIp?: string
  country?: string
  countryCode?: string
  baseLatencyMs?: number
  passedCount: number
  warnCount: number
  failedCount: number
  challengeCount: number
  checkedAt: number
  items: ProxyQualityCheckItem[]
}

// Gemini credentials structure for OAuth and API Key authentication
export interface GeminiCredentials {
  // API Key authentication
  apiKey?: string

  // OAuth authentication
  accessToken?: string
  refreshToken?: string
  oauthType?: 'code_assist' | 'google_one' | 'ai_studio' | string
  tierId?:
    | 'google_one_free'
    | 'google_ai_pro'
    | 'google_ai_ultra'
    | 'gcp_standard'
    | 'gcp_enterprise'
    | 'aistudio_free'
    | 'aistudio_paid'
    | 'LEGACY'
    | 'PRO'
    | 'ULTRA'
    | string
  projectId?: string
  tokenType?: string
  scope?: string
  expiresAt?: string
  modelMapping?: Record<string, string>
}

export type { TempUnschedulableRule } from '@/features/admin-accounts/domain/models/tempUnschedulableRule'
export type { TempUnschedulableState } from '@/features/admin-accounts/domain/models/tempUnschedulableState'
export type { TempUnschedulableStatus } from '@/features/admin-accounts/domain/models/tempUnschedulableStatus'

export interface UpstreamBillingData {
  object: 'sub2api.key_billing'
  schemaVersion: 1
  billingScope: 'token'
  groupRateMultiplier: number
  userRateMultiplier?: number
  resolvedRateMultiplier: number
  peakRateEnabled: boolean
  peakStart?: string
  peakEnd?: string
  peakRateMultiplier?: number
  appliedPeakMultiplier?: number
  effectiveRateMultiplier: number
  timezone?: string
  observedAt: string
}

export type UpstreamBillingProbeStatus = 'ok' | 'unsupported' | 'failed'

export interface UpstreamBillingProbeSnapshot {
  status: UpstreamBillingProbeStatus
  data?: UpstreamBillingData
  receivedAt?: string
  freshUntil?: string
  lastAttemptAt: string
  nextProbeAt: string
  failureCount?: number
  httpStatus?: number
  lastError?: string
}

export interface UpstreamBillingProbeSettings {
  enabled: boolean
  intervalMinutes: number
}

export interface UpstreamBillingProbeResult {
  accountId: number
  snapshot?: UpstreamBillingProbeSnapshot
  error?: string
}

export type { AccountHourlyUsageStats } from '@/features/admin-accounts/domain/models/accountHourlyUsageStats'

export { Account } from '@/features/admin-accounts/domain/models/account'

export type { AccountSchedulerGroupScore } from '@/features/admin-accounts/domain/models/accountSchedulerGroupScore'

export type { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'

export type { UsageProgress } from '@/features/admin-accounts/domain/models/usageProgress'

export type { AntigravityModelQuota } from '@/features/admin-accounts/domain/models/antigravityModelQuota'

export interface GrokQuotaWindow {
  limit?: number | null
  remaining?: number | null
  resetUnix?: number | null
  resetAt?: string | null
}

export interface GrokBillingProductUsage {
  product: string
  usagePercent?: number | null
}

export interface GrokBillingSummary {
  periodType?: string
  usagePercent?: number | null
  periodStart?: string
  periodEnd?: string
  productUsage?: GrokBillingProductUsage[]
  monthlyLimitCents?: number | null
  usedCents?: number | null
  includedUsedCents?: number | null
  billingPeriodStart?: string
  billingPeriodEnd?: string
  usedPercent?: number | null
  plan?: string
  statusCode?: number
  source?: string
  fetchedAt?: string
  updatedAt?: string
  weeklyUpdatedAt?: string
  monthlyUpdatedAt?: string
  partial?: boolean
  failedWindows?: string[]
}

export type { AccountUsageInfo } from '@/features/admin-accounts/domain/models/accountUsageInfo'

// OpenAI Codex usage snapshot (from response headers)
export interface CodexUsageSnapshot {
  // Legacy fields (kept for backwards compatibility)
  // NOTE: The naming is ambiguous - actual window type is determined by window_minutes value
  codexPrimaryUsedPercent?: number // Usage percentage (check window_minutes for actual window type)
  codexPrimaryResetAfterSeconds?: number // Seconds until reset
  codexPrimaryWindowMinutes?: number // Window in minutes
  codexSecondaryUsedPercent?: number // Usage percentage (check window_minutes for actual window type)
  codexSecondaryResetAfterSeconds?: number // Seconds until reset
  codexSecondaryWindowMinutes?: number // Window in minutes
  codexPrimaryOverSecondaryPercent?: number // Overflow ratio

  // Canonical fields (normalized by backend, use these preferentially)
  codex5hUsedPercent?: number // 5-hour window usage percentage
  codex5hResetAfterSeconds?: number // Seconds until 5h window reset
  codex5hResetAt?: string // 5-hour window absolute reset time (RFC3339)
  codex5hWindowMinutes?: number // 5h window in minutes (should be ~300)
  codex7dUsedPercent?: number // 7-day window usage percentage
  codex7dResetAfterSeconds?: number // Seconds until 7d window reset
  codex7dResetAt?: string // 7-day window absolute reset time (RFC3339)
  codex7dWindowMinutes?: number // 7d window in minutes (should be ~10080)

  codexUsageUpdatedAt?: string // Last update timestamp
}

export type OpenAICompactMode = 'auto' | 'force_on' | 'force_off'
export type OpenAIResponsesMode = 'auto' | 'force_responses' | 'force_chat_completions'
export type OpenAIEndpointCapability = 'chat_completions' | 'embeddings' | 'alpha_search'

export interface OpenAICompactState {
  openaiCompactMode?: OpenAICompactMode
  openaiCompactSupported?: boolean
  openaiCompactCheckedAt?: string
  openaiCompactLastStatus?: number
  openaiCompactLastError?: string
}

export interface OpenAIResponsesState {
  openaiResponsesMode?: OpenAIResponsesMode
  openaiResponsesSupported?: boolean
}

export type { CreateAccountRequest } from '@/features/admin-accounts/data/requests_models/createAccountRequest'

export type { UpdateAccountRequest } from '@/features/admin-accounts/data/requests_models/updateAccountRequest'

export type { CheckMixedChannelRequest } from '@/features/admin-accounts/data/requests_models/checkMixedChannelRequest'

export interface MixedChannelWarningDetails {
  groupId: number
  groupName: string
  currentPlatform: string
  otherPlatform: string
}

export type { CheckMixedChannelResponse } from '@/features/admin-accounts/domain/models/checkMixedChannelResponse'

export interface CreateProxyRequest {
  name: string
  protocol: ProxyProtocol
  host: string
  port: number
  username?: string | null
  password?: string | null
  expiresAt?: number | null   // unix 秒；null/0 = 永不过期
  fallbackMode?: 'none' | 'proxy' | 'direct'
  backupProxyId?: number | null
  expiryWarnDays?: number
}

export interface UpdateProxyRequest {
  name?: string
  protocol?: ProxyProtocol
  host?: string
  port?: number
  username?: string | null
  password?: string | null
  status?: 'active' | 'inactive'
  expiresAt?: number | null   // unix 秒；null/0 = 永不过期
  fallbackMode?: 'none' | 'proxy' | 'direct'
  backupProxyId?: number | null
  expiryWarnDays?: number
}

export type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
export type { AdminDataProxy } from '@/features/admin-accounts/domain/models/adminDataProxy'
export type { AdminDataAccount } from '@/features/admin-accounts/domain/models/adminDataAccount'

export type { AdminDataImportError } from '@/features/admin-accounts/domain/models/adminDataImportError'
export type { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'

export interface CodexSessionImportRequest {
  content?: string
  contents?: string[]
  name?: string
  notes?: string | null
  groupIds?: number[]
  proxyId?: number | null
  concurrency?: number
  priority?: number
  rateMultiplier?: number
  loadFactor?: number | null
  expiresAt?: number | null
  autoPauseOnExpired?: boolean
  credentialExtras?: Record<string, unknown>
  extra?: Record<string, unknown>
  updateExisting?: boolean
  skipDefaultGroupBind?: boolean
  confirmMixedChannelRisk?: boolean
}

export interface OpenAICodexPATCreateRequest {
  accessToken: string
  name?: string
  notes?: string | null
  groupIds?: number[]
  proxyId?: number | null
  concurrency?: number
  priority?: number
  rateMultiplier?: number
  loadFactor?: number | null
  expiresAt?: number | null
  autoPauseOnExpired?: boolean
  credentialExtras?: Record<string, unknown>
  extra?: Record<string, unknown>
  skipDefaultGroupBind?: boolean
  confirmMixedChannelRisk?: boolean
}

export interface CodexSessionImportMessage {
  index: number
  name?: string
  message: string
}

export interface CodexSessionImportItem {
  index: number
  name?: string
  action: 'created' | 'updated' | 'skipped' | 'failed'
  accountId?: number
  message?: string
}

export type { CodexSessionImportResult } from '@/features/admin-accounts/domain/models/codexSessionImportResult'

// ==================== Usage & Redeem Types ====================

export type RedeemCodeType = 'balance' | 'concurrency' | 'subscription' | 'invitation'
export type UsageRequestType = 'unknown' | 'sync' | 'stream' | 'ws_v2' | 'cyber'
export type ImageSizeSource = 'output' | 'input' | 'default' | 'legacy'
export type ImageSizeBreakdown = Record<string, number>

export interface UsageLog {
  id: number
  userId: number
  apiKeyId: number
  accountId: number | null
  requestId: string
  model: string
  serviceTier?: string | null
  reasoningEffort?: string | null
  inboundEndpoint?: string | null
  upstreamEndpoint?: string | null

  groupId: number | null
  subscriptionId: number | null

  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  cacheCreation5mTokens: number
  cacheCreation1hTokens: number

  inputCost: number
  outputCost: number
  cacheCreationCost: number
  cacheReadCost: number
  totalCost: number
  actualCost: number
  rateMultiplier: number
  longContextBillingApplied: boolean
  billingType: number

  requestType?: UsageRequestType
  stream: boolean
  openaiWsMode?: boolean
  durationMs: number | null
  firstTokenMs: number | null

  // 图片生成字段
  imageCount: number
  imageSize: string | null
  imageInputSize: string | null
  imageOutputSize: string | null
  imageSizeSource: ImageSizeSource | null
  imageSizeBreakdown: ImageSizeBreakdown | null
  imageInputTokens: number
  imageInputCost: number
  imageOutputTokens: number
  imageOutputCost: number

  // 视频生成字段
  videoCount?: number
  videoResolution?: string | null
  videoDurationSeconds?: number | null

  // User-Agent
  userAgent: string | null
  ipAddress?: string | null

  // Cache TTL Override
  cacheTtlOverridden: boolean

  // 计费模式
  billingMode?: string | null

  createdAt: string

  user?: User
  apiKey?: ApiKey
  group?: Group
  subscription?: UserSubscription
}

export interface UsageLogAccountSummary {
  id: number
  name: string
}

export interface AdminUsageLog extends UsageLog {
  upstreamModel?: string | null
  modelMappingChain?: string | null

  // 账号计费倍率（仅管理员可见）
  accountRateMultiplier?: number | null
  // 自定义定价规则计算的账号统计费用（nil 时使用 total_cost * multiplier）
  accountStatsCost?: number | null

  // 渠道 ID 和计费等级（仅管理员可见）
  channelId?: number | null
  billingTier?: string | null

  // 最小账号信息（仅管理员接口返回）
  account?: UsageLogAccountSummary
}

export interface UsageCleanupFilters {
  startTime: string
  endTime: string
  userId?: number
  apiKeyId?: number
  accountId?: number
  groupId?: number
  model?: string | null
  requestType?: UsageRequestType | null
  stream?: boolean | null
  billingType?: number | null
}

export interface UsageCleanupTask {
  id: number
  status: string
  filters: UsageCleanupFilters
  createdBy: number
  deletedRows: number
  errorMessage?: string | null
  canceledBy?: number | null
  canceledAt?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface RedeemCode {
  id: number
  code: string
  type: RedeemCodeType
  value: number
  status: 'active' | 'used' | 'expired' | 'unused' | 'disabled'
  maxUses: number
  usedCount: number
  maxUsesPerUser: number
  usedBy: number | null
  usedAt: string | null
  createdAt: string
  expiresAt?: string | null
  updatedAt?: string
  notes?: string
  groupId?: number | null // 订阅类型专用
  validityDays?: number // 订阅类型专用
  user?: User
  group?: Group // 关联的分组
}

export interface GenerateRedeemCodesRequest {
  count: number
  type: RedeemCodeType
  value: number
  groupId?: number | null // 订阅类型专用
  validityDays?: number // 订阅类型专用
  expiresAt?: string | null
  expiresInDays?: number
  maxUses?: number
  maxUsesPerUser?: number
}

export interface BatchUpdateRedeemCodeFields {
  status?: 'unused' | 'disabled'
  expiresAt?: string | null
  notes?: string
  groupId?: number | null
}

export interface BatchUpdateRedeemCodesRequest {
  ids: number[]
  fields: BatchUpdateRedeemCodeFields
}

export interface RedeemCodeRequest {
  code: string
}

// ==================== Dashboard & Statistics ====================

export interface DashboardStats {
  // 用户统计
  totalUsers: number
  todayNewUsers: number // 今日新增用户数
  activeUsers: number // 今日有请求的用户数
  hourlyActiveUsers: number // 当前小时活跃用户数（UTC）
  statsUpdatedAt: string // 统计更新时间（UTC RFC3339）
  statsStale: boolean // 统计是否过期

  // API Key 统计
  totalApiKeys: number
  activeApiKeys: number // 状态为 active 的 API Key 数

  // 账户统计
  totalAccounts: number
  normalAccounts: number // 正常账户数
  errorAccounts: number // 异常账户数
  ratelimitAccounts: number // 限流账户数
  overloadAccounts: number // 过载账户数

  // 累计 Token 使用统计
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCacheCreationTokens: number
  totalCacheReadTokens: number
  totalTokens: number
  totalCost: number // 累计标准计费
  totalActualCost: number // 累计实际扣除
  totalAccountCost: number // 累计账号成本

  // 今日 Token 使用统计
  todayRequests: number
  todayInputTokens: number
  todayOutputTokens: number
  todayCacheCreationTokens: number
  todayCacheReadTokens: number
  todayTokens: number
  todayCost: number // 今日标准计费
  todayActualCost: number // 今日实际扣除
  todayAccountCost: number // 今日账号成本

  // 系统运行统计
  averageDurationMs: number // 平均响应时间
  uptime: number // 系统运行时间(秒)

  // 性能指标
  rpm: number // 近5分钟平均每分钟请求数
  tpm: number // 近5分钟平均每分钟Token数
}

export interface UsageStatsResponse {
  period?: string
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCacheTokens: number
  totalCacheReadTokens: number
  totalCacheCreationTokens: number
  totalTokens: number
  totalCost: number // 标准计费
  totalActualCost: number // 实际扣除
  averageDurationMs: number
  models?: Record<string, number>
  endpoints?: EndpointStat[]
  upstreamEndpoints?: EndpointStat[]
  endpointPaths?: EndpointStat[]
}

// ==================== Trend & Chart Types ====================

export interface TrendDataPoint {
  date: string
  requests: number
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  totalTokens: number
  cost: number // 标准计费
  actualCost: number // 实际扣除
}

export interface ModelStat {
  model: string
  requests: number
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  totalTokens: number
  cost: number // 标准计费
  actualCost: number // 实际扣除
  accountCost?: number // 账号成本（仅管理员接口返回）
}

export interface EndpointStat {
  endpoint: string
  requests: number
  totalTokens: number
  cost: number
  actualCost: number
}

export interface GroupStat {
  groupId: number
  groupName: string
  requests: number
  totalTokens: number
  cost: number // 标准计费
  actualCost: number // 实际扣除
  accountCost?: number // 账号成本（仅管理员接口返回）
}

export interface UserBreakdownItem {
  userId: number
  email: string
  requests: number
  inputTokens: number
  outputTokens: number
  cacheTokens: number
  totalTokens: number
  cost: number
  actualCost: number
  accountCost: number
}

export interface UserUsageTrendPoint {
  date: string
  userId: number
  email: string
  username: string
  requests: number
  tokens: number
  cost: number // 标准计费
  actualCost: number // 实际扣除
}

export interface UserSpendingRankingItem {
  userId: number
  email: string
  actualCost: number
  requests: number
  tokens: number
}

export interface UserSpendingRankingResponse {
  ranking: UserSpendingRankingItem[]
  totalActualCost: number
  totalRequests: number
  totalTokens: number
  startDate: string
  endDate: string
}

export interface ApiKeyUsageTrendPoint {
  date: string
  apiKeyId: number
  keyName: string
  requests: number
  tokens: number
}

// ==================== Admin User Management ====================

export interface UpdateUserRequest {
  email?: string
  password?: string
  username?: string
  notes?: string
  role?: 'admin' | 'user'
  balance?: number
  concurrency?: number
  rpmLimit?: number
  status?: 'active' | 'disabled'
  allowedGroups?: number[] | null
  // 用户专属分组倍率配置 (group_id -> rate_multiplier | null)
  // null 表示删除该分组的专属倍率
  groupRates?: Record<number, number | null>
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// ==================== User Subscription Types ====================

export interface UserSubscription {
  id: number
  userId: number
  groupId: number
  status: 'active' | 'expired' | 'revoked' | 'suspended'
  startsAt: string
  dailyUsageUsd: number
  weeklyUsageUsd: number
  monthlyUsageUsd: number
  dailyWindowStart: string | null
  weeklyWindowStart: string | null
  monthlyWindowStart: string | null
  createdAt: string
  updatedAt: string
  revokedAt?: string | null
  expiresAt: string | null
  user?: User
  group?: Group
}

export interface SubscriptionProgress {
  subscriptionId: number
  daily: {
    used: number
    limit: number | null
    percentage: number
    resetInSeconds: number | null
  } | null
  weekly: {
    used: number
    limit: number | null
    percentage: number
    resetInSeconds: number | null
  } | null
  monthly: {
    used: number
    limit: number | null
    percentage: number
    resetInSeconds: number | null
  } | null
  expiresAt: string | null
  daysRemaining: number | null
}

export interface AssignSubscriptionRequest {
  userId: number
  groupId: number
  validityDays?: number
}

export interface BulkAssignSubscriptionRequest {
  userIds: number[]
  groupId: number
  validityDays?: number
}

export interface ExtendSubscriptionRequest {
  days: number
}

// ==================== Query Parameters ====================

export interface UserErrorRequest {
  id: number
  createdAt: string
  model: string
  inboundEndpoint: string
  statusCode: number
  category: string
  platform: string
  message: string
  keyName: string
  keyDeleted: boolean
  clientIp?: string
  groupName?: string
  requestType?: number
  stream?: boolean
  userAgent?: string
}

export interface UserErrorRequestDetail extends UserErrorRequest {
  errorBody: string
  upstreamStatusCode?: number
}

export interface UserErrorListParams {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  timezone?: string
  model?: string
  statusCode?: number
  category?: string
  apiKeyId?: number
  // 服务端排序,列白名单见后端 opsErrorLogsOrderBy(created_at/model/status_code)
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UsageQueryParams {
  page?: number
  pageSize?: number
  apiKeyId?: number
  userId?: number
  accountId?: number
  groupId?: number
  model?: string
  requestType?: UsageRequestType
  stream?: boolean
  billingType?: number | null
  billingMode?: string | null
  startDate?: string
  endDate?: string
  timezone?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ==================== Account Usage Statistics ====================

export type { AccountUsageHistory } from '@/features/admin-accounts/domain/models/accountUsageHistory'

export type { AccountUsageSummary } from '@/features/admin-accounts/domain/models/accountUsageSummary'

export type { AccountUsageStatsResponse } from '@/features/admin-accounts/domain/models/accountUsageStatsResponse'

// ==================== User Attribute Types ====================

export type UserAttributeType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'date' | 'select' | 'multi_select'

export interface UserAttributeOption {
  value: string
  label: string
  [key: string]: unknown
}

export interface UserAttributeValidation {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  message?: string
}

export interface UserAttributeDefinition {
  id: number
  key: string
  name: string
  description: string
  type: UserAttributeType
  options: UserAttributeOption[]
  required: boolean
  validation: UserAttributeValidation
  placeholder: string
  displayOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface UserAttributeValue {
  id: number
  userId: number
  attributeId: number
  value: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserAttributeRequest {
  key: string
  name: string
  description?: string
  type: UserAttributeType
  options?: UserAttributeOption[]
  required?: boolean
  validation?: UserAttributeValidation
  placeholder?: string
  displayOrder?: number
  enabled?: boolean
}

export interface UpdateUserAttributeRequest {
  key?: string
  name?: string
  description?: string
  type?: UserAttributeType
  options?: UserAttributeOption[]
  required?: boolean
  validation?: UserAttributeValidation
  placeholder?: string
  displayOrder?: number
  enabled?: boolean
}

export interface UserAttributeValuesMap {
  [attributeId: number]: string
}

// ==================== Promo Code Types ====================

export interface PromoCode {
  id: number
  code: string
  bonusAmount: number
  maxUses: number
  usedCount: number
  status: 'active' | 'disabled'
  expiresAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface PromoCodeUsage {
  id: number
  promoCodeId: number
  userId: number
  bonusAmount: number
  usedAt: string
  user?: User
}

export interface CreatePromoCodeRequest {
  code?: string
  bonusAmount: number
  maxUses?: number
  expiresAt?: number | null
  notes?: string
}

export interface UpdatePromoCodeRequest {
  code?: string
  bonusAmount?: number
  maxUses?: number
  status?: 'active' | 'disabled'
  expiresAt?: number | null
  notes?: string
}

// ==================== TOTP (2FA) Types ====================

export interface TotpStatus {
  enabled: boolean
  enabledAt: number | null  // Unix timestamp in seconds
  featureEnabled: boolean
}

export interface TotpSetupRequest {
  emailCode?: string
  password?: string
}

export interface TotpSetupResponse {
  secret: string
  qrCodeUrl: string
  setupToken: string
  countdown: number
}

export interface TotpEnableRequest {
  totpCode: string
  setupToken: string
}

export interface TotpEnableResponse {
  success: boolean
}

export interface TotpDisableRequest {
  emailCode?: string
  password?: string
}

export interface TotpVerificationMethod {
  method: 'email' | 'password'
}

export interface TotpLoginResponse {
  requires2fa: boolean
  tempToken?: string
  userEmailMasked?: string
}

export interface TotpLogin2FARequest {
  tempToken: string
  totpCode: string
}

// ==================== Scheduled Test Types ====================

export type { ScheduledTestPlan } from '@/features/admin-accounts/domain/models/scheduledTestPlan'
export type { ScheduledTestResult } from '@/features/admin-accounts/domain/models/scheduledTestResult'
export type { CreateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/createScheduledTestPlanRequest'
export type { UpdateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/updateScheduledTestPlanRequest'

// Payment types
export type { SubscriptionPlan, PaymentOrder, CheckoutInfoResponse } from './payment'

export type {
  PlatformQuotaItem,
  PlatformQuotaUpdateItem,
  PlatformQuotaPlatform,
  PlatformQuotaWindow,
  PlatformQuotasResponse,
} from '@/features/admin-users/data/datasources/adminUsersDatasource'
