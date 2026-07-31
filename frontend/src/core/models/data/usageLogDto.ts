import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UsageLog } from '@/core/models/domain/usageLog'
import type { UsageRequestType, ImageSizeSource, ImageSizeBreakdown } from '@/core/models/domain/usageLog'

export class UsageLogDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'api_key_id' }) @Transform(({ value }) => value ?? 0) apiKeyId!: number
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose({ name: 'request_id' }) @Transform(({ value }) => value ?? '') requestId!: string
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose({ name: 'service_tier' }) @Transform(({ value }) => value ?? '') serviceTier!: string
  @Expose({ name: 'reasoning_effort' }) @Transform(({ value }) => value ?? '') reasoningEffort!: string
  @Expose({ name: 'inbound_endpoint' }) @Transform(({ value }) => value ?? '') inboundEndpoint!: string
  @Expose({ name: 'upstream_endpoint' }) @Transform(({ value }) => value ?? '') upstreamEndpoint!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'subscription_id' }) @Transform(({ value }) => value ?? 0) subscriptionId!: number
  @Expose({ name: 'input_tokens' }) @Transform(({ value }) => value ?? 0) inputTokens!: number
  @Expose({ name: 'output_tokens' }) @Transform(({ value }) => value ?? 0) outputTokens!: number
  @Expose({ name: 'cache_creation_tokens' }) @Transform(({ value }) => value ?? 0) cacheCreationTokens!: number
  @Expose({ name: 'cache_read_tokens' }) @Transform(({ value }) => value ?? 0) cacheReadTokens!: number
  @Expose({ name: 'cache_creation_5m_tokens' }) @Transform(({ value }) => value ?? 0) cacheCreation5mTokens!: number
  @Expose({ name: 'cache_creation_1h_tokens' }) @Transform(({ value }) => value ?? 0) cacheCreation1hTokens!: number
  @Expose({ name: 'input_cost' }) @Transform(({ value }) => value ?? 0) inputCost!: number
  @Expose({ name: 'output_cost' }) @Transform(({ value }) => value ?? 0) outputCost!: number
  @Expose({ name: 'cache_creation_cost' }) @Transform(({ value }) => value ?? 0) cacheCreationCost!: number
  @Expose({ name: 'cache_read_cost' }) @Transform(({ value }) => value ?? 0) cacheReadCost!: number
  @Expose({ name: 'total_cost' }) @Transform(({ value }) => value ?? 0) totalCost!: number
  @Expose({ name: 'actual_cost' }) @Transform(({ value }) => value ?? 0) actualCost!: number
  @Expose({ name: 'rate_multiplier' }) @Transform(({ value }) => value ?? 1) rateMultiplier!: number
  @Expose({ name: 'long_context_billing_applied' }) @Transform(({ value }) => value ?? false) longContextBillingApplied!: boolean
  @Expose({ name: 'billing_type' }) @Transform(({ value }) => value ?? 0) billingType!: number
  @Expose({ name: 'request_type' }) @Transform(({ value }) => value ?? 'unknown') requestType!: UsageRequestType
  @Expose() @Transform(({ value }) => value ?? false) stream!: boolean
  @Expose({ name: 'duration_ms' }) @Transform(({ value }) => value ?? 0) durationMs!: number
  @Expose({ name: 'first_token_ms' }) @Transform(({ value }) => value ?? 0) firstTokenMs!: number
  @Expose({ name: 'image_count' }) @Transform(({ value }) => value ?? 0) imageCount!: number
  @Expose({ name: 'image_size' }) @Transform(({ value }) => value ?? '') imageSize!: string
  @Expose({ name: 'image_input_size' }) @Transform(({ value }) => value ?? '') imageInputSize!: string
  @Expose({ name: 'image_output_size' }) @Transform(({ value }) => value ?? '') imageOutputSize!: string
  @Expose({ name: 'image_size_source' }) @Transform(({ value }) => value ?? '') imageSizeSource!: ImageSizeSource | ''
  @Expose({ name: 'image_size_breakdown' }) @Transform(({ value }) => value ?? {}) imageSizeBreakdown!: ImageSizeBreakdown
  @Expose({ name: 'image_input_tokens' }) @Transform(({ value }) => value ?? 0) imageInputTokens!: number
  @Expose({ name: 'image_input_cost' }) @Transform(({ value }) => value ?? 0) imageInputCost!: number
  @Expose({ name: 'image_output_tokens' }) @Transform(({ value }) => value ?? 0) imageOutputTokens!: number
  @Expose({ name: 'image_output_cost' }) @Transform(({ value }) => value ?? 0) imageOutputCost!: number
  @Expose({ name: 'video_count' }) @Transform(({ value }) => value ?? 0) videoCount!: number
  @Expose({ name: 'video_resolution' }) @Transform(({ value }) => value ?? '') videoResolution!: string
  @Expose({ name: 'video_duration_seconds' }) @Transform(({ value }) => value ?? 0) videoDurationSeconds!: number
  @Expose({ name: 'user_agent' }) @Transform(({ value }) => value ?? '') userAgent!: string
  @Expose({ name: 'ip_address' }) @Transform(({ value }) => value ?? '') ipAddress!: string
  @Expose({ name: 'cache_ttl_overridden' }) @Transform(({ value }) => value ?? false) cacheTtlOverridden!: boolean
  @Expose({ name: 'billing_mode' }) @Transform(({ value }) => value ?? '') billingMode!: string
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string

  static fromJson(json: unknown): UsageLogDto {
    return plainToInstance(UsageLogDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UsageLog {
    const e = new UsageLog()
    e.id = this.id
    e.userId = this.userId
    e.apiKeyId = this.apiKeyId
    e.accountId = this.accountId
    e.requestId = this.requestId
    e.model = this.model
    e.serviceTier = this.serviceTier
    e.reasoningEffort = this.reasoningEffort
    e.inboundEndpoint = this.inboundEndpoint
    e.upstreamEndpoint = this.upstreamEndpoint
    e.groupId = this.groupId
    e.subscriptionId = this.subscriptionId
    e.inputTokens = this.inputTokens
    e.outputTokens = this.outputTokens
    e.cacheCreationTokens = this.cacheCreationTokens
    e.cacheReadTokens = this.cacheReadTokens
    e.cacheCreation5mTokens = this.cacheCreation5mTokens
    e.cacheCreation1hTokens = this.cacheCreation1hTokens
    e.inputCost = this.inputCost
    e.outputCost = this.outputCost
    e.cacheCreationCost = this.cacheCreationCost
    e.cacheReadCost = this.cacheReadCost
    e.totalCost = this.totalCost
    e.actualCost = this.actualCost
    e.rateMultiplier = this.rateMultiplier
    e.longContextBillingApplied = this.longContextBillingApplied
    e.billingType = this.billingType
    e.requestType = this.requestType
    e.stream = this.stream
    e.durationMs = this.durationMs
    e.firstTokenMs = this.firstTokenMs
    e.imageCount = this.imageCount
    e.imageSize = this.imageSize
    e.imageInputSize = this.imageInputSize
    e.imageOutputSize = this.imageOutputSize
    e.imageSizeSource = this.imageSizeSource
    e.imageSizeBreakdown = this.imageSizeBreakdown
    e.imageInputTokens = this.imageInputTokens
    e.imageInputCost = this.imageInputCost
    e.imageOutputTokens = this.imageOutputTokens
    e.imageOutputCost = this.imageOutputCost
    e.videoCount = this.videoCount
    e.videoResolution = this.videoResolution
    e.videoDurationSeconds = this.videoDurationSeconds
    e.userAgent = this.userAgent
    e.ipAddress = this.ipAddress
    e.cacheTtlOverridden = this.cacheTtlOverridden
    e.billingMode = this.billingMode
    e.createdAt = this.createdAt
    return e
  }
}
