import { PlatformConcurrencyInfo } from './platformConcurrencyInfo'
import { GroupConcurrencyInfo } from './groupConcurrencyInfo'
import { AccountConcurrencyInfo } from './accountConcurrencyInfo'

export class OpsConcurrencyStats {
  enabled!: boolean
  platform!: Record<string, PlatformConcurrencyInfo>
  group!: Record<string, GroupConcurrencyInfo>
  account!: Record<string, AccountConcurrencyInfo>
  timestamp!: string
}
