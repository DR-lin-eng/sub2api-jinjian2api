import type { GrokQuotaWindow } from '@/features/admin-accounts/domain/models/grokQuotaWindow'
export class GrokQuotaSnapshot {
  requests?: GrokQuotaWindow
  tokens?: GrokQuotaWindow
  retryAfterSeconds!: number
  subscriptionTier!: string
  entitlementStatus!: string
  statusCode!: number
  headers!: Record<string, string>
  headersObserved!: boolean
  observationSource!: string
  lastProbeAt!: string
  lastHeadersSeenAt!: string
  updatedAt!: string
}
