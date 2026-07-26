import type { ApiKey } from '@/core/models/domain/apiKey'
import type { Group } from '@/core/models/domain/group'
import type { User } from '@/core/models/domain/user'

export type UsageRequestType = 'unknown' | 'sync' | 'stream' | 'ws_v2' | 'cyber'
export type ImageSizeSource = 'output' | 'input' | 'default' | 'legacy'
export type ImageSizeBreakdown = Record<string, number>

export class UsageLog {
  id!: number
  userId!: number
  apiKeyId!: number
  accountId!: number
  requestId!: string
  model!: string
  serviceTier!: string
  reasoningEffort!: string
  inboundEndpoint!: string
  upstreamEndpoint!: string
  groupId!: number
  subscriptionId!: number
  inputTokens!: number
  outputTokens!: number
  cacheCreationTokens!: number
  cacheReadTokens!: number
  cacheCreation5mTokens!: number
  cacheCreation1hTokens!: number
  inputCost!: number
  outputCost!: number
  cacheCreationCost!: number
  cacheReadCost!: number
  totalCost!: number
  actualCost!: number
  rateMultiplier!: number
  longContextBillingApplied!: boolean
  billingType!: number
  requestType!: UsageRequestType
  stream!: boolean
  durationMs!: number
  firstTokenMs!: number
  imageCount!: number
  imageSize!: string
  imageInputSize!: string
  imageOutputSize!: string
  imageSizeSource!: ImageSizeSource | ''
  imageSizeBreakdown!: ImageSizeBreakdown
  imageInputTokens!: number
  imageInputCost!: number
  imageOutputTokens!: number
  imageOutputCost!: number
  videoCount!: number
  videoResolution!: string
  videoDurationSeconds!: number
  userAgent!: string
  ipAddress!: string
  cacheTtlOverridden!: boolean
  billingMode!: string
  createdAt!: string
  user?: User
  apiKey?: ApiKey
  group?: Group
}
