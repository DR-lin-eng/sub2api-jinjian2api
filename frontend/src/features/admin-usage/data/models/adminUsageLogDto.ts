import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UsageLogDto } from '@/core/models/data/usageLogDto'
import { AdminUsageLog } from '@/features/admin-usage/domain/models/adminUsageLog'
import { UsageLogAccountSummaryDto } from '@/core/models/data/usageLogAccountSummaryDto'

export class AdminUsageLogDto extends UsageLogDto {
  @Expose({ name: 'upstream_model' }) @Transform(({ value }) => value ?? '') upstreamModel!: string
  @Expose({ name: 'model_mapping_chain' }) @Transform(({ value }) => value ?? '') modelMappingChain!: string
  @Expose({ name: 'account_rate_multiplier' }) @Transform(({ value }) => value ?? 0) accountRateMultiplier!: number
  @Expose({ name: 'account_stats_cost' }) @Transform(({ value }) => value ?? 0) accountStatsCost!: number
  @Expose({ name: 'channel_id' }) @Transform(({ value }) => value ?? 0) channelId!: number
  @Expose({ name: 'billing_tier' }) @Transform(({ value }) => value ?? '') billingTier!: string
  @Expose() account?: UsageLogAccountSummaryDto

  static fromJson(json: unknown): AdminUsageLogDto {
    return plainToInstance(AdminUsageLogDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminUsageLog {
    const base = super.toEntity()
    const e = new AdminUsageLog()
    Object.assign(e, base)
    e.upstreamModel = this.upstreamModel
    e.modelMappingChain = this.modelMappingChain
    e.accountRateMultiplier = this.accountRateMultiplier
    e.accountStatsCost = this.accountStatsCost
    e.channelId = this.channelId
    e.billingTier = this.billingTier
    e.account = this.account?.toEntity()
    return e
  }
}
