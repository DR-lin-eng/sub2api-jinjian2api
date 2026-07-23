import type {
  ContentModerationAPIKeyLoad,
  ContentModerationAPIKeyStatus,
  ContentModerationAPIKeyStatusValue,
  ContentModerationConfig,
  ContentModerationLog,
  ContentModerationLogsResponse,
  ContentModerationModelFilter,
  ContentModerationModelFilterType,
  ContentModerationRuntimeStatus,
  ContentModerationTestAuditResult,
  ClearFlaggedHashesResponse,
  DeleteFlaggedHashResponse,
  ContentModerationUnbanUserResponse,
  TestContentModerationAPIKeysResponse,
  KeywordBlockingMode,
  ModerationMode,
} from '@/features/admin-risk-control/domain/models/adminRiskControl'

// ── Re-export union types (same values, no mapping needed) ──────────────────
export type { ModerationMode, KeywordBlockingMode, ContentModerationModelFilterType, ContentModerationAPIKeyStatusValue }

// ── ContentModerationModelFilterDto ────────────────────────────────────────
export interface ContentModerationModelFilterDto {
  type: ContentModerationModelFilterType
  models: string[]
}

export function modelFilterToEntity(dto: ContentModerationModelFilterDto): ContentModerationModelFilter {
  return {
    type: dto.type ?? 'all',
    models: dto.models ?? [],
  }
}

// ── ContentModerationAPIKeyStatusDto ───────────────────────────────────────
export interface ContentModerationAPIKeyStatusDto {
  index: number
  key_hash: string
  masked: string
  status: ContentModerationAPIKeyStatusValue
  failure_count: number
  success_count: number
  last_error: string
  last_checked_at?: string
  frozen_until?: string
  last_latency_ms: number
  last_http_status: number
  last_tested: boolean
  configured: boolean
}

export function apiKeyStatusToEntity(dto: ContentModerationAPIKeyStatusDto): ContentModerationAPIKeyStatus {
  return {
    index: dto.index ?? 0,
    keyHash: dto.key_hash ?? '',
    masked: dto.masked ?? '',
    status: dto.status ?? 'unknown',
    failureCount: dto.failure_count ?? 0,
    successCount: dto.success_count ?? 0,
    lastError: dto.last_error ?? '',
    lastCheckedAt: dto.last_checked_at,
    frozenUntil: dto.frozen_until,
    lastLatencyMs: dto.last_latency_ms ?? 0,
    lastHttpStatus: dto.last_http_status ?? 0,
    lastTested: dto.last_tested ?? false,
    configured: dto.configured ?? false,
  }
}

// ── ContentModerationConfigDto ─────────────────────────────────────────────
export interface ContentModerationConfigDto {
  enabled: boolean
  mode: ModerationMode
  base_url: string
  model: string
  api_key_configured: boolean
  api_key_masked: string
  api_key_count: number
  api_key_masks: string[]
  api_key_statuses: ContentModerationAPIKeyStatusDto[]
  timeout_ms: number
  sample_rate: number
  all_groups: boolean
  group_ids: number[]
  record_non_hits: boolean
  thresholds: Record<string, number>
  worker_count: number
  queue_size: number
  block_status: number
  block_message: string
  email_on_hit: boolean
  auto_ban_enabled: boolean
  ban_threshold: number
  violation_window_hours: number
  retry_count: number
  hit_retention_days: number
  non_hit_retention_days: number
  pre_hash_check_enabled: boolean
  blocked_keywords: string[]
  keyword_blocking_mode: KeywordBlockingMode
  model_filter: ContentModerationModelFilterDto
  cyber_policy_exclude_from_ban_count: boolean
}

export function configToEntity(dto: ContentModerationConfigDto): ContentModerationConfig {
  return {
    enabled: dto.enabled ?? false,
    mode: dto.mode ?? 'off',
    baseUrl: dto.base_url ?? '',
    model: dto.model ?? '',
    apiKeyConfigured: dto.api_key_configured ?? false,
    apiKeyMasked: dto.api_key_masked ?? '',
    apiKeyCount: dto.api_key_count ?? 0,
    apiKeyMasks: dto.api_key_masks ?? [],
    apiKeyStatuses: (dto.api_key_statuses ?? []).map(apiKeyStatusToEntity),
    timeoutMs: dto.timeout_ms ?? 0,
    sampleRate: dto.sample_rate ?? 1,
    allGroups: dto.all_groups ?? false,
    groupIds: dto.group_ids ?? [],
    recordNonHits: dto.record_non_hits ?? false,
    thresholds: dto.thresholds ?? {},
    workerCount: dto.worker_count ?? 0,
    queueSize: dto.queue_size ?? 0,
    blockStatus: dto.block_status ?? 200,
    blockMessage: dto.block_message ?? '',
    emailOnHit: dto.email_on_hit ?? false,
    autoBanEnabled: dto.auto_ban_enabled ?? false,
    banThreshold: dto.ban_threshold ?? 0,
    violationWindowHours: dto.violation_window_hours ?? 0,
    retryCount: dto.retry_count ?? 0,
    hitRetentionDays: dto.hit_retention_days ?? 0,
    nonHitRetentionDays: dto.non_hit_retention_days ?? 0,
    preHashCheckEnabled: dto.pre_hash_check_enabled ?? false,
    blockedKeywords: dto.blocked_keywords ?? [],
    keywordBlockingMode: dto.keyword_blocking_mode ?? 'keyword_only',
    modelFilter: modelFilterToEntity(dto.model_filter ?? { type: 'all', models: [] }),
    cyberPolicyExcludeFromBanCount: dto.cyber_policy_exclude_from_ban_count ?? false,
  }
}

// ── ContentModerationTestAuditResultDto ────────────────────────────────────
export interface ContentModerationTestAuditResultDto {
  flagged: boolean
  highest_category: string
  highest_score: number
  composite_score: number
  category_scores: Record<string, number>
  thresholds: Record<string, number>
}

export function testAuditResultToEntity(dto: ContentModerationTestAuditResultDto): ContentModerationTestAuditResult {
  return {
    flagged: dto.flagged ?? false,
    highestCategory: dto.highest_category ?? '',
    highestScore: dto.highest_score ?? 0,
    compositeScore: dto.composite_score ?? 0,
    categoryScores: dto.category_scores ?? {},
    thresholds: dto.thresholds ?? {},
  }
}

// ── TestContentModerationAPIKeysResponseDto ────────────────────────────────
export interface TestContentModerationAPIKeysResponseDto {
  items: ContentModerationAPIKeyStatusDto[]
  audit_result?: ContentModerationTestAuditResultDto
  image_count: number
}

export function testAPIKeysResponseToEntity(dto: TestContentModerationAPIKeysResponseDto): TestContentModerationAPIKeysResponse {
  return {
    items: (dto.items ?? []).map(apiKeyStatusToEntity),
    auditResult: dto.audit_result ? testAuditResultToEntity(dto.audit_result) : undefined,
    imageCount: dto.image_count ?? 0,
  }
}

// ── ContentModerationAPIKeyLoadDto ─────────────────────────────────────────
export interface ContentModerationAPIKeyLoadDto {
  index: number
  key_hash: string
  masked: string
  status: ContentModerationAPIKeyStatusValue
  active: number
  total: number
  success: number
  errors: number
  avg_latency_ms: number
  last_latency_ms: number
  last_http_status: number
}

export function apiKeyLoadToEntity(dto: ContentModerationAPIKeyLoadDto): ContentModerationAPIKeyLoad {
  return {
    index: dto.index ?? 0,
    keyHash: dto.key_hash ?? '',
    masked: dto.masked ?? '',
    status: dto.status ?? 'unknown',
    active: dto.active ?? 0,
    total: dto.total ?? 0,
    success: dto.success ?? 0,
    errors: dto.errors ?? 0,
    avgLatencyMs: dto.avg_latency_ms ?? 0,
    lastLatencyMs: dto.last_latency_ms ?? 0,
    lastHttpStatus: dto.last_http_status ?? 0,
  }
}

// ── ContentModerationRuntimeStatusDto ─────────────────────────────────────
export interface ContentModerationRuntimeStatusDto {
  enabled: boolean
  risk_control_enabled: boolean
  mode: ModerationMode
  worker_count: number
  max_workers: number
  active_workers: number
  idle_workers: number
  queue_size: number
  queue_length: number
  queue_usage_percent: number
  enqueued: number
  dropped: number
  processed: number
  errors: number
  pre_block_active: number
  pre_block_checked: number
  pre_block_allowed: number
  pre_block_blocked: number
  pre_block_errors: number
  pre_block_avg_latency_ms: number
  pre_block_api_key_active: number
  pre_block_api_key_available_count: number
  pre_block_api_key_total_calls: number
  pre_block_api_key_loads: ContentModerationAPIKeyLoadDto[]
  api_key_statuses: ContentModerationAPIKeyStatusDto[]
  flagged_hash_count: number
  last_cleanup_at?: string
  last_cleanup_deleted_hit: number
  last_cleanup_deleted_non_hit: number
}

export function runtimeStatusToEntity(dto: ContentModerationRuntimeStatusDto): ContentModerationRuntimeStatus {
  return {
    enabled: dto.enabled ?? false,
    riskControlEnabled: dto.risk_control_enabled ?? false,
    mode: dto.mode ?? 'off',
    workerCount: dto.worker_count ?? 0,
    maxWorkers: dto.max_workers ?? 0,
    activeWorkers: dto.active_workers ?? 0,
    idleWorkers: dto.idle_workers ?? 0,
    queueSize: dto.queue_size ?? 0,
    queueLength: dto.queue_length ?? 0,
    queueUsagePercent: dto.queue_usage_percent ?? 0,
    enqueued: dto.enqueued ?? 0,
    dropped: dto.dropped ?? 0,
    processed: dto.processed ?? 0,
    errors: dto.errors ?? 0,
    preBlockActive: dto.pre_block_active ?? 0,
    preBlockChecked: dto.pre_block_checked ?? 0,
    preBlockAllowed: dto.pre_block_allowed ?? 0,
    preBlockBlocked: dto.pre_block_blocked ?? 0,
    preBlockErrors: dto.pre_block_errors ?? 0,
    preBlockAvgLatencyMs: dto.pre_block_avg_latency_ms ?? 0,
    preBlockApiKeyActive: dto.pre_block_api_key_active ?? 0,
    preBlockApiKeyAvailableCount: dto.pre_block_api_key_available_count ?? 0,
    preBlockApiKeyTotalCalls: dto.pre_block_api_key_total_calls ?? 0,
    preBlockApiKeyLoads: (dto.pre_block_api_key_loads ?? []).map(apiKeyLoadToEntity),
    apiKeyStatuses: (dto.api_key_statuses ?? []).map(apiKeyStatusToEntity),
    flaggedHashCount: dto.flagged_hash_count ?? 0,
    lastCleanupAt: dto.last_cleanup_at,
    lastCleanupDeletedHit: dto.last_cleanup_deleted_hit ?? 0,
    lastCleanupDeletedNonHit: dto.last_cleanup_deleted_non_hit ?? 0,
  }
}

// ── ContentModerationLogDto ────────────────────────────────────────────────
export interface ContentModerationLogDto {
  id: number
  request_id: string
  user_id: number | null
  user_email: string
  api_key_id: number | null
  api_key_name: string
  group_id: number | null
  group_name: string
  endpoint: string
  provider: string
  model: string
  mode: string
  action: string
  flagged: boolean
  highest_category: string
  highest_score: number
  matched_keyword: string
  category_scores: Record<string, number>
  threshold_snapshot: Record<string, number>
  input_excerpt: string
  upstream_latency_ms: number | null
  error: string
  violation_count: number
  auto_banned: boolean
  email_sent: boolean
  user_status: string
  queue_delay_ms: number | null
  created_at: string
}

export function logToEntity(dto: ContentModerationLogDto): ContentModerationLog {
  return {
    id: dto.id ?? 0,
    requestId: dto.request_id ?? '',
    userId: dto.user_id ?? null,
    userEmail: dto.user_email ?? '',
    apiKeyId: dto.api_key_id ?? null,
    apiKeyName: dto.api_key_name ?? '',
    groupId: dto.group_id ?? null,
    groupName: dto.group_name ?? '',
    endpoint: dto.endpoint ?? '',
    provider: dto.provider ?? '',
    model: dto.model ?? '',
    mode: dto.mode ?? '',
    action: dto.action ?? '',
    flagged: dto.flagged ?? false,
    highestCategory: dto.highest_category ?? '',
    highestScore: dto.highest_score ?? 0,
    matchedKeyword: dto.matched_keyword ?? '',
    categoryScores: dto.category_scores ?? {},
    thresholdSnapshot: dto.threshold_snapshot ?? {},
    inputExcerpt: dto.input_excerpt ?? '',
    upstreamLatencyMs: dto.upstream_latency_ms ?? null,
    error: dto.error ?? '',
    violationCount: dto.violation_count ?? 0,
    autoBanned: dto.auto_banned ?? false,
    emailSent: dto.email_sent ?? false,
    userStatus: dto.user_status ?? '',
    queueDelayMs: dto.queue_delay_ms ?? null,
    createdAt: dto.created_at ?? '',
  }
}

// ── ContentModerationLogsResponseDto ──────────────────────────────────────
export interface ContentModerationLogsResponseDto {
  items: ContentModerationLogDto[]
  total: number
  page: number
  page_size: number
  pages: number
}

export function logsResponseToEntity(dto: ContentModerationLogsResponseDto): ContentModerationLogsResponse {
  return {
    items: (dto.items ?? []).map(logToEntity),
    total: dto.total ?? 0,
    page: dto.page ?? 1,
    pageSize: dto.page_size ?? 20,
    pages: dto.pages ?? 0,
  }
}

// ── ContentModerationUnbanUserResponseDto ─────────────────────────────────
export interface ContentModerationUnbanUserResponseDto {
  user_id: number
  status: string
}

export function unbanUserResponseToEntity(dto: ContentModerationUnbanUserResponseDto): ContentModerationUnbanUserResponse {
  return {
    userId: dto.user_id ?? 0,
    status: dto.status ?? '',
  }
}

// ── DeleteFlaggedHashResponseDto ───────────────────────────────────────────
export interface DeleteFlaggedHashResponseDto {
  input_hash: string
  deleted: boolean
}

export function deleteFlaggedHashResponseToEntity(dto: DeleteFlaggedHashResponseDto): DeleteFlaggedHashResponse {
  return {
    inputHash: dto.input_hash ?? '',
    deleted: dto.deleted ?? false,
  }
}

// ── ClearFlaggedHashesResponseDto ──────────────────────────────────────────
export interface ClearFlaggedHashesResponseDto {
  deleted: number
}

export function clearFlaggedHashesResponseToEntity(dto: ClearFlaggedHashesResponseDto): ClearFlaggedHashesResponse {
  return {
    deleted: dto.deleted ?? 0,
  }
}
