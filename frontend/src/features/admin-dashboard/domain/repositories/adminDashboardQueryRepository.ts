import type { DashboardStats } from '@/features/admin-dashboard/domain/models/dashboardStats'
import type { DashboardRealtimeMetrics } from '@/features/admin-dashboard/domain/models/dashboardRealtimeMetrics'
import type { TrendResponse } from '@/features/admin-dashboard/domain/models/trendResponse'
import type { ModelStatsResponse } from '@/features/admin-dashboard/domain/models/modelStatsResponse'
import type { GroupStatsResponse } from '@/features/admin-dashboard/domain/models/groupStatsResponse'
import type { UserBreakdownResponse } from '@/features/admin-dashboard/domain/models/userBreakdownResponse'
import type { ApiKeyTrendResponse } from '@/features/admin-dashboard/domain/models/apiKeyTrendResponse'
import type { UserTrendResponse } from '@/features/admin-dashboard/domain/models/userTrendResponse'
import type { UserSpendingRankingResponse } from '@/features/admin-dashboard/domain/models/userSpendingRankingResponse'
import type { BatchUsersUsageResponse } from '@/features/admin-dashboard/domain/models/batchUsersUsageResponse'
import type { BatchApiKeysUsageResponse } from '@/features/admin-dashboard/domain/models/batchApiKeysUsageResponse'
import type { AdminDashboardTrendRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardTrendRequest'
import type { AdminDashboardModelStatsRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardModelStatsRequest'
import type { AdminDashboardGroupStatsRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardGroupStatsRequest'
import type { AdminDashboardUserBreakdownRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardUserBreakdownRequest'
import type { AdminDashboardSnapshotV2Request } from '@/features/admin-dashboard/data/requests_models/adminDashboardSnapshotV2Request'
import type { AdminDashboardApiKeyTrendRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardApiKeyTrendRequest'
import type { AdminDashboardUserTrendRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardUserTrendRequest'
import type { AdminDashboardUserSpendingRankingRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardUserSpendingRankingRequest'
import type { AdminDashboardBatchUsersUsageRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardBatchUsersUsageRequest'
import type { AdminDashboardBatchApiKeysUsageRequest } from '@/features/admin-dashboard/data/requests_models/adminDashboardBatchApiKeysUsageRequest'

export interface AdminDashboardQueryRepository {
  getStats(): Promise<DashboardStats>
  getRealtimeMetrics(): Promise<DashboardRealtimeMetrics>
  getUsageTrend(params?: AdminDashboardTrendRequest): Promise<TrendResponse>
  getModelStats(params?: AdminDashboardModelStatsRequest): Promise<ModelStatsResponse>
  getGroupStats(params?: AdminDashboardGroupStatsRequest): Promise<GroupStatsResponse>
  getUserBreakdown(params: AdminDashboardUserBreakdownRequest): Promise<UserBreakdownResponse>
  getSnapshotV2(params?: AdminDashboardSnapshotV2Request): Promise<unknown>
  getApiKeyUsageTrend(params?: AdminDashboardApiKeyTrendRequest): Promise<ApiKeyTrendResponse>
  getUserUsageTrend(params?: AdminDashboardUserTrendRequest): Promise<UserTrendResponse>
  getUserSpendingRanking(params?: AdminDashboardUserSpendingRankingRequest): Promise<UserSpendingRankingResponse>
  getBatchUsersUsage(req: AdminDashboardBatchUsersUsageRequest): Promise<BatchUsersUsageResponse>
  getBatchApiKeysUsage(req: AdminDashboardBatchApiKeysUsageRequest): Promise<BatchApiKeysUsageResponse>
}
