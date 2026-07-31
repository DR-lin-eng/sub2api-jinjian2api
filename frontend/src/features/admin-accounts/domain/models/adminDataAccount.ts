import type { AccountPlatform } from '@/core/enums/accountPlatform'
import type { AccountType } from '@/core/enums/accountType'
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
