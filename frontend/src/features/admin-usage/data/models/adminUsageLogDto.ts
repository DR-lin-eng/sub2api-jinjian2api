import type { AdminUsageLog, UsageLogAccountSummary } from '@/features/admin-usage/domain/models/adminUsage'
import { type UsageLogDto, toEntity as usageLogToEntity } from './usageLogDto'

export interface AdminUsageLogDto extends UsageLogDto {
  upstream_model?: string | null
  model_mapping_chain?: string | null
  account_rate_multiplier?: number | null
  account_stats_cost?: number | null
  channel_id?: number | null
  billing_tier?: string | null
  account?: UsageLogAccountSummary
}

export function toEntity(dto: AdminUsageLogDto): AdminUsageLog {
  return {
    ...usageLogToEntity(dto),
    upstreamModel: dto.upstream_model,
    modelMappingChain: dto.model_mapping_chain,
    accountRateMultiplier: dto.account_rate_multiplier,
    accountStatsCost: dto.account_stats_cost,
    channelId: dto.channel_id,
    billingTier: dto.billing_tier,
    account: dto.account,
  }
}
