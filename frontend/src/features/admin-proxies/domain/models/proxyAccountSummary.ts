import type { AccountPlatform } from '@/core/enums/accountPlatform'
import type { AccountType } from '@/core/enums/accountType'
export class ProxyAccountSummary {
  id!: number
  name!: string
  platform!: AccountPlatform
  type!: AccountType
  notes?: string
}
