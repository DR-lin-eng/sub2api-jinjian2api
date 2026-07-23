import type { AccountPlatform, AccountType } from '@/types'

export interface CreateAccountRequest {
  name: string
  notes?: string | null
  platform: AccountPlatform
  type: AccountType
  credentials: Record<string, unknown>
  extra?: Record<string, unknown>
  proxyId?: number | null
  concurrency?: number
  loadFactor?: number | null
  priority?: number
  rateMultiplier?: number
  groupIds?: number[]
  expiresAt?: number | null
  autoPauseOnExpired?: boolean
  upstreamBillingProbeEnabled?: boolean
  confirmMixedChannelRisk?: boolean
}
