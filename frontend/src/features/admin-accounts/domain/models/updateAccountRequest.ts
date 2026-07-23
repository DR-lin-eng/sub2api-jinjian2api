import type { AccountType } from '@/types'

export interface UpdateAccountRequest {
  name?: string
  notes?: string | null
  type?: AccountType
  credentials?: Record<string, unknown>
  extra?: Record<string, unknown>
  proxyId?: number | null
  concurrency?: number
  loadFactor?: number | null
  priority?: number
  rateMultiplier?: number
  schedulable?: boolean
  status?: 'active' | 'inactive' | 'error'
  groupIds?: number[]
  expiresAt?: number | null
  autoPauseOnExpired?: boolean
  confirmMixedChannelRisk?: boolean
}
