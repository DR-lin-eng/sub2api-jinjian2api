import type { AccountPlatform } from '@/features/admin-accounts/enums/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/enums/accountType'
export class ProxyAccountSummary {
  id!: number
  name!: string
  platform!: AccountPlatform
  type!: AccountType
  notes?: string
}
