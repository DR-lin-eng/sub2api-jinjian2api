import type { GrokQuotaWindow } from '@/types'

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
