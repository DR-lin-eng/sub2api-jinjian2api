import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { ChannelStatus, BillingModelSource } from '@/core/constants/channel'
import { Channel } from '@/features/admin-channels/domain/models/channel'
import { ChannelModelPricingDto } from '@/features/admin-channels/data/models/channelModelPricingDto'
import { AccountStatsPricingRuleDto } from '@/features/admin-channels/data/models/accountStatsPricingRuleDto'

export class ChannelDto {
  @Expose()
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  status!: ChannelStatus

  @Expose({ name: 'billing_model_source' })
  billingModelSource!: BillingModelSource

  @Expose({ name: 'restrict_models' })
  @Transform(({ value }) => value ?? false)
  restrictModels!: boolean

  @Expose({ name: 'features_config' })
  featuresConfig?: Record<string, unknown>

  @Expose({ name: 'group_ids' })
  @Transform(({ value }) => value ?? [])
  groupIds!: number[]

  @Expose({ name: 'model_pricing' })
  @Transform(({ value }) => value ?? [])
  @Type(() => ChannelModelPricingDto)
  modelPricing!: ChannelModelPricingDto[]

  @Expose({ name: 'model_mapping' })
  @Transform(({ value }) => value ?? {})
  modelMapping!: Record<string, Record<string, string>>

  @Expose({ name: 'apply_pricing_to_account_stats' })
  @Transform(({ value }) => value ?? false)
  applyPricingToAccountStats!: boolean

  @Expose({ name: 'account_stats_pricing_rules' })
  @Transform(({ value }) => value ?? [])
  @Type(() => AccountStatsPricingRuleDto)
  accountStatsPricingRules!: AccountStatsPricingRuleDto[]

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): ChannelDto {
    return plainToInstance(ChannelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): Channel {
    const entity = new Channel()
    entity.id = this.id
    entity.name = this.name
    entity.description = this.description
    entity.status = this.status
    entity.billingModelSource = this.billingModelSource
    entity.restrictModels = this.restrictModels
    entity.featuresConfig = this.featuresConfig
    entity.groupIds = this.groupIds
    entity.modelPricing = this.modelPricing.map(p => p.toEntity())
    entity.modelMapping = this.modelMapping
    entity.applyPricingToAccountStats = this.applyPricingToAccountStats
    entity.accountStatsPricingRules = this.accountStatsPricingRules.map(r => r.toEntity())
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
