import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { Group } from '@/core/models/domain/group'
import { OpenAIMessagesDispatchModelConfigDto } from '@/core/models/data/openAIMessagesDispatchModelConfigDto'

export class GroupDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? null)
  description!: string | null

  @Expose()
  @Transform(({ value }) => value ?? 'anthropic')
  platform!: 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok' | 'composite'

  @Expose({ name: 'rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  rateMultiplier!: number

  @Expose({ name: 'rpm_limit' })
  rpmLimit?: number

  @Expose({ name: 'is_exclusive' })
  @Transform(({ value }) => value ?? false)
  isExclusive!: boolean

  @Expose()
  @Transform(({ value }) => value ?? 'active')
  status!: 'active' | 'inactive'

  @Expose({ name: 'subscription_type' })
  @Transform(({ value }) => value ?? 'standard')
  subscriptionType!: 'standard' | 'subscription'

  @Expose({ name: 'daily_limit_usd' })
  @Transform(({ value }) => value ?? null)
  dailyLimitUsd!: number | null

  @Expose({ name: 'weekly_limit_usd' })
  @Transform(({ value }) => value ?? null)
  weeklyLimitUsd!: number | null

  @Expose({ name: 'monthly_limit_usd' })
  @Transform(({ value }) => value ?? null)
  monthlyLimitUsd!: number | null

  @Expose({ name: 'allow_image_generation' })
  @Transform(({ value }) => value ?? false)
  allowImageGeneration!: boolean

  @Expose({ name: 'openai_force_image_tool' })
  @Transform(({ value }) => value ?? false)
  openaiForceImageTool!: boolean

  @Expose({ name: 'allow_batch_image_generation' })
  @Transform(({ value }) => value ?? false)
  allowBatchImageGeneration!: boolean

  @Expose({ name: 'image_rate_independent' })
  @Transform(({ value }) => value ?? false)
  imageRateIndependent!: boolean

  @Expose({ name: 'image_rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  imageRateMultiplier!: number

  @Expose({ name: 'batch_image_discount_multiplier' })
  @Transform(({ value }) => value ?? 1)
  batchImageDiscountMultiplier!: number

  @Expose({ name: 'batch_image_hold_multiplier' })
  @Transform(({ value }) => value ?? 1)
  batchImageHoldMultiplier!: number

  @Expose({ name: 'image_price_1k' })
  @Transform(({ value }) => value ?? null)
  imagePrice1k!: number | null

  @Expose({ name: 'image_price_2k' })
  @Transform(({ value }) => value ?? null)
  imagePrice2k!: number | null

  @Expose({ name: 'image_price_4k' })
  @Transform(({ value }) => value ?? null)
  imagePrice4k!: number | null

  @Expose({ name: 'video_rate_independent' })
  @Transform(({ value }) => value ?? false)
  videoRateIndependent!: boolean

  @Expose({ name: 'video_rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  videoRateMultiplier!: number

  @Expose({ name: 'video_price_480p' })
  @Transform(({ value }) => value ?? null)
  videoPrice480p!: number | null

  @Expose({ name: 'video_price_720p' })
  @Transform(({ value }) => value ?? null)
  videoPrice720p!: number | null

  @Expose({ name: 'video_price_1080p' })
  @Transform(({ value }) => value ?? null)
  videoPrice1080p!: number | null

  @Expose({ name: 'web_search_price_per_call' })
  @Transform(({ value }) => value ?? null)
  webSearchPricePerCall!: number | null

  @Expose({ name: 'peak_rate_enabled' })
  @Transform(({ value }) => value ?? false)
  peakRateEnabled!: boolean

  @Expose({ name: 'peak_start' })
  @Transform(({ value }) => value ?? '')
  peakStart!: string

  @Expose({ name: 'peak_end' })
  @Transform(({ value }) => value ?? '')
  peakEnd!: string

  @Expose({ name: 'peak_rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  peakRateMultiplier!: number

  @Expose({ name: 'claude_code_only' })
  @Transform(({ value }) => value ?? false)
  claudeCodeOnly!: boolean

  @Expose({ name: 'fallback_group_id' })
  @Transform(({ value }) => value ?? null)
  fallbackGroupId!: number | null

  @Expose({ name: 'fallback_group_id_on_invalid_request' })
  @Transform(({ value }) => value ?? null)
  fallbackGroupIdOnInvalidRequest!: number | null

  @Expose({ name: 'allow_messages_dispatch' })
  allowMessagesDispatch?: boolean

  @Expose({ name: 'default_mapped_model' })
  defaultMappedModel?: string

  @Expose({ name: 'messages_dispatch_model_config' })
  @Type(() => OpenAIMessagesDispatchModelConfigDto)
  messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfigDto

  @Expose({ name: 'require_oauth_only' })
  @Transform(({ value }) => value ?? false)
  requireOauthOnly!: boolean

  @Expose({ name: 'require_privacy_set' })
  @Transform(({ value }) => value ?? false)
  requirePrivacySet!: boolean

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): GroupDto {
    return plainToInstance(GroupDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): Group {
    const entity = new Group()
    entity.id = this.id
    entity.name = this.name
    entity.description = this.description
    entity.platform = this.platform
    entity.rateMultiplier = this.rateMultiplier
    entity.rpmLimit = this.rpmLimit
    entity.isExclusive = this.isExclusive
    entity.status = this.status
    entity.subscriptionType = this.subscriptionType
    entity.dailyLimitUsd = this.dailyLimitUsd
    entity.weeklyLimitUsd = this.weeklyLimitUsd
    entity.monthlyLimitUsd = this.monthlyLimitUsd
    entity.allowImageGeneration = this.allowImageGeneration
    entity.openaiForceImageTool = this.openaiForceImageTool
    entity.allowBatchImageGeneration = this.allowBatchImageGeneration
    entity.imageRateIndependent = this.imageRateIndependent
    entity.imageRateMultiplier = this.imageRateMultiplier
    entity.batchImageDiscountMultiplier = this.batchImageDiscountMultiplier
    entity.batchImageHoldMultiplier = this.batchImageHoldMultiplier
    entity.imagePrice1k = this.imagePrice1k
    entity.imagePrice2k = this.imagePrice2k
    entity.imagePrice4k = this.imagePrice4k
    entity.videoRateIndependent = this.videoRateIndependent
    entity.videoRateMultiplier = this.videoRateMultiplier
    entity.videoPrice480p = this.videoPrice480p
    entity.videoPrice720p = this.videoPrice720p
    entity.videoPrice1080p = this.videoPrice1080p
    entity.webSearchPricePerCall = this.webSearchPricePerCall
    entity.peakRateEnabled = this.peakRateEnabled
    entity.peakStart = this.peakStart
    entity.peakEnd = this.peakEnd
    entity.peakRateMultiplier = this.peakRateMultiplier
    entity.claudeCodeOnly = this.claudeCodeOnly
    entity.fallbackGroupId = this.fallbackGroupId
    entity.fallbackGroupIdOnInvalidRequest = this.fallbackGroupIdOnInvalidRequest
    entity.allowMessagesDispatch = this.allowMessagesDispatch
    entity.defaultMappedModel = this.defaultMappedModel
    entity.messagesDispatchModelConfig = this.messagesDispatchModelConfig?.toEntity()
    entity.requireOauthOnly = this.requireOauthOnly
    entity.requirePrivacySet = this.requirePrivacySet
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
