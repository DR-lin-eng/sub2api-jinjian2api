import type { AccountPlatform, AccountType } from '@/types'

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
