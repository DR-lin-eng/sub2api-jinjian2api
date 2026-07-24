import type { BalanceHistoryUserRef } from '@/features/admin-users/domain/models/balanceHistoryUserRef'
import type { BalanceHistoryGroupRef } from '@/features/admin-users/domain/models/balanceHistoryGroupRef'

export class BalanceHistoryItem {
  id!: number
  code!: string
  type!: string
  value!: number
  status!: string
  usedBy!: number
  usedAt!: string
  createdAt!: string
  groupId!: number
  validityDays!: number
  notes!: string
  userInfo?: BalanceHistoryUserRef
  groupInfo?: BalanceHistoryGroupRef
}
