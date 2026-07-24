import type { AccountPlatform, AccountType } from '@/types'

export class ProxyAccountSummary {
  id!: number
  name!: string
  platform!: AccountPlatform
  type!: AccountType
  notes?: string
}
