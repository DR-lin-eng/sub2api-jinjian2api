import { UsageProgress } from '@/features/admin-accounts/domain/models/usageProgress'
import { AntigravityModelQuota } from '@/features/admin-accounts/domain/models/antigravityModelQuota'
import { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'
import { AccountAiCredit } from '@/features/admin-accounts/domain/models/accountAiCredit'
import type { GrokBillingSummary } from '@/features/admin-accounts/domain/models/grokBillingSummary'
import type { GrokQuotaWindow } from '@/features/admin-accounts/domain/models/grokQuotaWindow'
export class AccountUsageInfo {
  source!: 'passive' | 'active' | ''
  updatedAt!: string
  fiveHour?: UsageProgress
  sevenDay?: UsageProgress
  sevenDaySonnet?: UsageProgress
  sevenDayFable?: UsageProgress
  geminiSharedDaily?: UsageProgress
  geminiProDaily?: UsageProgress
  geminiFlashDaily?: UsageProgress
  geminiSharedMinute?: UsageProgress
  geminiProMinute?: UsageProgress
  geminiFlashMinute?: UsageProgress
  antigravityQuota!: Record<string, AntigravityModelQuota>
  grokRequestQuota?: GrokQuotaWindow
  grokTokenQuota?: GrokQuotaWindow
  grokRetryAfterSeconds!: number
  grokEntitlementStatus!: string
  grokQuotaSnapshotState!: string
  grokLastQuotaProbeAt!: string
  grokLastHeadersSeenAt!: string
  grokLastStatusCode!: number
  grokFreeTokenLimit!: number
  grokLocalUsage?: WindowStats
  grokLocalUsage24h?: WindowStats
  grokLocalUsage7d?: WindowStats
  grokLocalUsageMonthly?: WindowStats
  grokBilling?: GrokBillingSummary
  subscriptionTier!: string
  subscriptionTierRaw!: string
  aiCredits!: AccountAiCredit[]
  isForbidden!: boolean
  forbiddenReason!: string
  forbiddenType!: string
  validationUrl!: string
  needsVerify!: boolean
  isBanned!: boolean
  needsReauth!: boolean
  errorCode!: string
  error!: string
}
