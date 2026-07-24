export type ModerationMode = 'off' | 'observe' | 'pre_block'
export type KeywordBlockingMode = 'keyword_only' | 'keyword_and_api' | 'api_only'
export type ContentModerationModelFilterType = 'all' | 'include' | 'exclude'
export type ContentModerationAPIKeyStatusValue = 'unknown' | 'ok' | 'error' | 'frozen'

export interface ContentModerationModelFilter {
  type: ContentModerationModelFilterType
  models: string[]
}

export interface ContentModerationAPIKeyStatus {
  index: number
  keyHash: string
  masked: string
  status: ContentModerationAPIKeyStatusValue
  failureCount: number
  successCount: number
  lastError: string
  lastCheckedAt?: string
  frozenUntil?: string
  lastLatencyMs: number
  lastHttpStatus: number
  lastTested: boolean
  configured: boolean
}

export interface ContentModerationConfig {
  enabled: boolean
  mode: ModerationMode
  baseUrl: string
  model: string
  apiKeyConfigured: boolean
  apiKeyMasked: string
  apiKeyCount: number
  apiKeyMasks: string[]
  apiKeyStatuses: ContentModerationAPIKeyStatus[]
  timeoutMs: number
  sampleRate: number
  allGroups: boolean
  groupIds: number[]
  recordNonHits: boolean
  thresholds: Record<string, number>
  workerCount: number
  queueSize: number
  blockStatus: number
  blockMessage: string
  emailOnHit: boolean
  autoBanEnabled: boolean
  banThreshold: number
  violationWindowHours: number
  retryCount: number
  hitRetentionDays: number
  nonHitRetentionDays: number
  preHashCheckEnabled: boolean
  blockedKeywords: string[]
  keywordBlockingMode: KeywordBlockingMode
  modelFilter: ContentModerationModelFilter
  cyberPolicyExcludeFromBanCount: boolean
}

export interface ContentModerationTestAuditResult {
  flagged: boolean
  highestCategory: string
  highestScore: number
  compositeScore: number
  categoryScores: Record<string, number>
  thresholds: Record<string, number>
}

export interface TestContentModerationAPIKeysPayload {
  apiKeys?: string[]
  baseUrl?: string
  model?: string
  timeoutMs?: number
  prompt?: string
  images?: string[]
}

export interface TestContentModerationAPIKeysResponse {
  items: ContentModerationAPIKeyStatus[]
  auditResult?: ContentModerationTestAuditResult
  imageCount: number
}

export interface UpdateContentModerationConfig {
  enabled?: boolean
  mode?: ModerationMode
  baseUrl?: string
  model?: string
  apiKey?: string
  apiKeys?: string[]
  apiKeysMode?: 'append' | 'replace'
  deleteApiKeyHashes?: string[]
  clearApiKey?: boolean
  timeoutMs?: number
  sampleRate?: number
  allGroups?: boolean
  groupIds?: number[]
  recordNonHits?: boolean
  thresholds?: Record<string, number>
  workerCount?: number
  queueSize?: number
  blockStatus?: number
  blockMessage?: string
  emailOnHit?: boolean
  autoBanEnabled?: boolean
  banThreshold?: number
  violationWindowHours?: number
  retryCount?: number
  hitRetentionDays?: number
  nonHitRetentionDays?: number
  preHashCheckEnabled?: boolean
  blockedKeywords?: string[]
  keywordBlockingMode?: KeywordBlockingMode
  modelFilter?: ContentModerationModelFilter
  cyberPolicyExcludeFromBanCount?: boolean
}

export interface ContentModerationAPIKeyLoad {
  index: number
  keyHash: string
  masked: string
  status: ContentModerationAPIKeyStatusValue
  active: number
  total: number
  success: number
  errors: number
  avgLatencyMs: number
  lastLatencyMs: number
  lastHttpStatus: number
}

export interface ContentModerationRuntimeStatus {
  enabled: boolean
  riskControlEnabled: boolean
  mode: ModerationMode
  workerCount: number
  maxWorkers: number
  activeWorkers: number
  idleWorkers: number
  queueSize: number
  queueLength: number
  queueUsagePercent: number
  enqueued: number
  dropped: number
  processed: number
  errors: number
  preBlockActive: number
  preBlockChecked: number
  preBlockAllowed: number
  preBlockBlocked: number
  preBlockErrors: number
  preBlockAvgLatencyMs: number
  preBlockApiKeyActive: number
  preBlockApiKeyAvailableCount: number
  preBlockApiKeyTotalCalls: number
  preBlockApiKeyLoads: ContentModerationAPIKeyLoad[]
  apiKeyStatuses: ContentModerationAPIKeyStatus[]
  flaggedHashCount: number
  lastCleanupAt?: string
  lastCleanupDeletedHit: number
  lastCleanupDeletedNonHit: number
}

export interface ContentModerationLog {
  id: number
  requestId: string
  userId: number | null
  userEmail: string
  apiKeyId: number | null
  apiKeyName: string
  groupId: number | null
  groupName: string
  endpoint: string
  provider: string
  model: string
  mode: string
  action: string
  flagged: boolean
  highestCategory: string
  highestScore: number
  matchedKeyword: string
  categoryScores: Record<string, number>
  thresholdSnapshot: Record<string, number>
  inputExcerpt: string
  upstreamLatencyMs: number | null
  error: string
  violationCount: number
  autoBanned: boolean
  emailSent: boolean
  userStatus: string
  queueDelayMs: number | null
  createdAt: string
}

export interface ListContentModerationLogsParams {
  page?: number
  pageSize?: number
  result?: string
  groupId?: number
  endpoint?: string
  search?: string
  from?: string
  to?: string
}

export interface ContentModerationLogsResponse {
  items: ContentModerationLog[]
  total: number
  page: number
  pageSize: number
  pages: number
}

export interface ContentModerationUnbanUserResponse {
  userId: number
  status: string
}

export interface DeleteFlaggedHashResponse {
  inputHash: string
  deleted: boolean
}

export interface ClearFlaggedHashesResponse {
  deleted: number
}
