import type { UserSpendingRankingItem } from './userSpendingRankingItem'

export class UserSpendingRankingResponse {
  ranking!: UserSpendingRankingItem[]
  totalActualCost!: number
  totalRequests!: number
  totalTokens!: number
  startDate!: string
  endDate!: string
}
