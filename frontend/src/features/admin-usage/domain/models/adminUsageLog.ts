import { UsageLog } from '@/core/models/domain/usageLog'
import type { UsageLogAccountSummary } from '@/core/models/domain/usageLogAccountSummary'

export class AdminUsageLog extends UsageLog {
  upstreamModel!: string
  modelMappingChain!: string
  accountRateMultiplier!: number
  accountStatsCost!: number
  channelId!: number
  billingTier!: string
  account?: UsageLogAccountSummary
}
