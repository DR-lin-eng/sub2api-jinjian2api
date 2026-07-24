import type { AccountPlatform } from '@/features/admin-accounts/domain/models/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/domain/models/accountType'
export class ProxyAccountSummary {
  id!: number
  name!: string
  platform!: AccountPlatform
  type!: AccountType
  notes?: string
}
