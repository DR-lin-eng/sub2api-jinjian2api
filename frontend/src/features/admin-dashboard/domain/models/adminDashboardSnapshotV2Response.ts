import type { DashboardStats } from '@/features/admin-dashboard/domain/models/dashboardStats'
import type { TrendDataPoint } from '@/features/admin-dashboard/domain/models/trendDataPoint'
import type { ModelStat } from '@/features/admin-dashboard/domain/models/modelStat'
import type { GroupStat } from '@/features/admin-dashboard/domain/models/groupStat'
import type { UserUsageTrendPoint } from '@/features/admin-dashboard/domain/models/userUsageTrendPoint'
import type { UserSpendingRankingItem } from '@/features/admin-dashboard/domain/models/userSpendingRankingItem'

export class AdminDashboardSnapshotV2Response {
  generatedAt!: string
  startDate!: string
  endDate!: string
  granularity!: string
  stats?: DashboardStats
  trend?: TrendDataPoint[]
  models?: ModelStat[]
  groups?: GroupStat[]
  usersTrend?: UserUsageTrendPoint[]
  ranking?: UserSpendingRankingItem[]
  rankingTotalActualCost?: number
  rankingTotalRequests?: number
  rankingTotalTokens?: number
}
