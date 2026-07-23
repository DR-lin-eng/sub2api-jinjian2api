import type { EndpointStat } from '@/features/admin-dashboard/domain/models/endpointStat'
import type { ApiKey, Group, User } from '@/types'
export type { EndpointStat }

export interface UsageLogAccountSummary {
  id: number
  name: string
}

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
  durationMs: number | null
  firstTokenMs: number | null
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
  videoCount?: number
  videoResolution?: string | null
  videoDurationSeconds?: number | null
  userAgent: string | null
  ipAddress?: string | null
  cacheTtlOverridden: boolean
  billingMode?: string | null
  createdAt: string
  user?: User
  apiKey?: ApiKey
  group?: Group
}

export interface AdminUsageLog extends UsageLog {
  upstreamModel?: string | null
  modelMappingChain?: string | null
  accountRateMultiplier?: number | null
  accountStatsCost?: number | null
  channelId?: number | null
  billingTier?: string | null
  account?: UsageLogAccountSummary
}

export interface AdminUsageStatsResponse {
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCacheTokens: number
  totalCacheCreationTokens: number
  totalCacheReadTokens: number
  totalTokens: number
  totalCost: number
  totalActualCost: number
  totalAccountCost: number
  averageDurationMs: number
  models?: Record<string, number>
  endpoints?: EndpointStat[]
  upstreamEndpoints?: EndpointStat[]
  endpointPaths?: EndpointStat[]
}

export interface AdminUsageQueryParams {
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

export type UsageQueryParams = AdminUsageQueryParams

export interface UsageStatsResponse {
  period?: string
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCacheTokens: number
  totalCacheReadTokens: number
  totalCacheCreationTokens: number
  totalTokens: number
  totalCost: number
  totalActualCost: number
  averageDurationMs: number
  models?: Record<string, number>
  endpoints?: EndpointStat[]
  upstreamEndpoints?: EndpointStat[]
  endpointPaths?: EndpointStat[]
}


export interface UsageCleanupTask {
  id: number
  status: string
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

