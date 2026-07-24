import type { GrokBillingProductUsage } from './grokBillingProductUsage'

export type GrokBillingSummary = {
  periodType?: string
  usagePercent?: number | null
  periodStart?: string
  periodEnd?: string
  productUsage?: GrokBillingProductUsage[]
  monthlyLimitCents?: number | null
  usedCents?: number | null
  includedUsedCents?: number | null
  billingPeriodStart?: string
  billingPeriodEnd?: string
  usedPercent?: number | null
  plan?: string
  statusCode?: number
  source?: string
  fetchedAt?: string
  updatedAt?: string
  weeklyUpdatedAt?: string
  monthlyUpdatedAt?: string
  partial?: boolean
  failedWindows?: string[]
}
