import type {
  UsageLog,
  UsageRequestType, ImageSizeSource, ImageSizeBreakdown,
} from '@/features/admin-usage/domain/models/adminUsage'

export interface UsageLogDto {
  id: number
  user_id: number
  api_key_id: number
  account_id: number | null
  request_id: string
  model: string
  service_tier?: string | null
  reasoning_effort?: string | null
  inbound_endpoint?: string | null
  upstream_endpoint?: string | null
  group_id: number | null
  subscription_id: number | null
  input_tokens: number
  output_tokens: number
  cache_creation_tokens: number
  cache_read_tokens: number
  cache_creation_5m_tokens: number
  cache_creation_1h_tokens: number
  input_cost: number
  output_cost: number
  cache_creation_cost: number
  cache_read_cost: number
  total_cost: number
  actual_cost: number
  rate_multiplier: number
  long_context_billing_applied: boolean
  billing_type: number
  request_type?: UsageRequestType
  stream: boolean
  duration_ms: number | null
  first_token_ms: number | null
  image_count: number
  image_size: string | null
  image_input_size: string | null
  image_output_size: string | null
  image_size_source: ImageSizeSource | null
  image_size_breakdown: ImageSizeBreakdown | null
  image_input_tokens: number
  image_input_cost: number
  image_output_tokens: number
  image_output_cost: number
  video_count?: number
  video_resolution?: string | null
  video_duration_seconds?: number | null
  user_agent: string | null
  ip_address?: string | null
  cache_ttl_overridden: boolean
  billing_mode?: string | null
  created_at: string
}

export function toEntity(dto: UsageLogDto): UsageLog {
  return {
    id: dto.id ?? 0,
    userId: dto.user_id ?? 0,
    apiKeyId: dto.api_key_id ?? 0,
    accountId: dto.account_id ?? null,
    requestId: dto.request_id ?? '',
    model: dto.model ?? '',
    serviceTier: dto.service_tier,
    reasoningEffort: dto.reasoning_effort,
    inboundEndpoint: dto.inbound_endpoint,
    upstreamEndpoint: dto.upstream_endpoint,
    groupId: dto.group_id ?? null,
    subscriptionId: dto.subscription_id ?? null,
    inputTokens: dto.input_tokens ?? 0,
    outputTokens: dto.output_tokens ?? 0,
    cacheCreationTokens: dto.cache_creation_tokens ?? 0,
    cacheReadTokens: dto.cache_read_tokens ?? 0,
    cacheCreation5mTokens: dto.cache_creation_5m_tokens ?? 0,
    cacheCreation1hTokens: dto.cache_creation_1h_tokens ?? 0,
    inputCost: dto.input_cost ?? 0,
    outputCost: dto.output_cost ?? 0,
    cacheCreationCost: dto.cache_creation_cost ?? 0,
    cacheReadCost: dto.cache_read_cost ?? 0,
    totalCost: dto.total_cost ?? 0,
    actualCost: dto.actual_cost ?? 0,
    rateMultiplier: dto.rate_multiplier ?? 1,
    longContextBillingApplied: dto.long_context_billing_applied ?? false,
    billingType: dto.billing_type ?? 0,
    requestType: dto.request_type,
    stream: dto.stream ?? false,
    durationMs: dto.duration_ms ?? null,
    firstTokenMs: dto.first_token_ms ?? null,
    imageCount: dto.image_count ?? 0,
    imageSize: dto.image_size ?? null,
    imageInputSize: dto.image_input_size ?? null,
    imageOutputSize: dto.image_output_size ?? null,
    imageSizeSource: dto.image_size_source ?? null,
    imageSizeBreakdown: dto.image_size_breakdown ?? null,
    imageInputTokens: dto.image_input_tokens ?? 0,
    imageInputCost: dto.image_input_cost ?? 0,
    imageOutputTokens: dto.image_output_tokens ?? 0,
    imageOutputCost: dto.image_output_cost ?? 0,
    videoCount: dto.video_count,
    videoResolution: dto.video_resolution,
    videoDurationSeconds: dto.video_duration_seconds,
    userAgent: dto.user_agent ?? null,
    ipAddress: dto.ip_address,
    cacheTtlOverridden: dto.cache_ttl_overridden ?? false,
    billingMode: dto.billing_mode,
    createdAt: dto.created_at ?? '',
  }
}
