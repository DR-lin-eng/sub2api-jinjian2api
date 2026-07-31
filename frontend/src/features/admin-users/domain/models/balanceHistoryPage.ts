import type { BalanceHistoryItem } from '@/features/admin-users/domain/models/balanceHistoryItem'

export class BalanceHistoryPage {
  items!: BalanceHistoryItem[]
  total!: number
  page!: number
  pageSize!: number
  pages!: number
  totalRecharged!: number
}
