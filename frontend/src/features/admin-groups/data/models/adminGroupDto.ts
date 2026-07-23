import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AdminGroup } from '@/features/admin-groups/domain/models/adminGroup'
import { GroupDto } from './groupDto'
import { ModelsListConfigDto } from './modelsListConfigDto'
import { OpenAIMessagesDispatchModelConfigDto } from './openAIMessagesDispatchModelConfigDto'

export class AdminGroupDto extends GroupDto {
  @Expose({ name: 'model_routing' })
  @Transform(({ value }) => value ?? null)
  modelRouting!: Record<string, number[]> | null

  @Expose({ name: 'model_routing_enabled' })
  @Transform(({ value }) => value ?? false)
  modelRoutingEnabled!: boolean

  @Expose({ name: 'mcp_xml_inject' })
  @Transform(({ value }) => value ?? false)
  mcpXmlInject!: boolean

  @Expose({ name: 'supported_model_scopes' })
  supportedModelScopes?: string[]

  @Expose({ name: 'account_count' })
  accountCount?: number

  @Expose({ name: 'active_account_count' })
  activeAccountCount?: number

  @Expose({ name: 'rate_limited_account_count' })
  rateLimitedAccountCount?: number

  @Expose({ name: 'models_list_config' })
  @Type(() => ModelsListConfigDto)
  modelsListConfig?: ModelsListConfigDto

  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? 0)
  sortOrder!: number

  // Override parent's messagesDispatchModelConfig to ensure correct @Type
  @Expose({ name: 'messages_dispatch_model_config' })
  @Type(() => OpenAIMessagesDispatchModelConfigDto)
  declare messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfigDto

  static fromJson(json: unknown): AdminGroupDto {
    return plainToInstance(AdminGroupDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminGroup {
    const entity = new AdminGroup()
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
    entity.modelRouting = this.modelRouting
    entity.modelRoutingEnabled = this.modelRoutingEnabled
    entity.mcpXmlInject = this.mcpXmlInject
    entity.supportedModelScopes = this.supportedModelScopes
    entity.accountCount = this.accountCount
    entity.activeAccountCount = this.activeAccountCount
    entity.rateLimitedAccountCount = this.rateLimitedAccountCount
    entity.modelsListConfig = this.modelsListConfig?.toEntity()
    entity.sortOrder = this.sortOrder
    return entity
  }
}
