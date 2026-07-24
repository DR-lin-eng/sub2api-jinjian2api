import type { AccountPlatform } from '@/features/admin-accounts/domain/models/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/domain/models/accountType'
export interface CreateAccountRequest {
  name: string
  notes?: string
  platform: AccountPlatform
  type: AccountType
  credentials: Record<string, unknown>
  extra?: Record<string, unknown>
  proxy_id?: number
  concurrency?: number
  load_factor?: number
  priority?: number
  rate_multiplier?: number
  group_ids?: number[]
  expires_at?: number
  auto_pause_on_expired?: boolean
  upstream_billing_probe_enabled?: boolean
  confirm_mixed_channel_risk?: boolean
}
