import type { AccountPlatform } from '@/features/admin-accounts/domain/models/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/domain/models/accountType'
export class AdminDataAccount {
  name!: string
  notes!: string
  platform!: AccountPlatform
  type!: AccountType
  credentials!: Record<string, unknown>
  extra!: Record<string, unknown>
  proxyKey!: string
  concurrency!: number
  priority!: number
  rateMultiplier!: number
  expiresAt!: number
  autoPauseOnExpired!: boolean
}
