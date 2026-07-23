import { adminDashboardQueryDatasource } from '@/features/admin-dashboard/data/datasources/adminDashboardQueryDatasource'
import type { AdminDashboardQueryRepository } from '@/features/admin-dashboard/domain/repositories/adminDashboardQueryRepository'
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

class AdminDashboardQueryRepositoryImpl implements AdminDashboardQueryRepository {
  private readonly ds = adminDashboardQueryDatasource

  async getStats(): Promise<DashboardStats> {
    return (await this.ds.getStats()).toEntity()
  }

  async getRealtimeMetrics(): Promise<DashboardRealtimeMetrics> {
    return (await this.ds.getRealtimeMetrics()).toEntity()
  }

  async getUsageTrend(params?: AdminDashboardTrendRequest): Promise<TrendResponse> {
    return (await this.ds.getUsageTrend(params)).toEntity()
  }

  async getModelStats(params?: AdminDashboardModelStatsRequest): Promise<ModelStatsResponse> {
    return (await this.ds.getModelStats(params)).toEntity()
  }

  async getGroupStats(params?: AdminDashboardGroupStatsRequest): Promise<GroupStatsResponse> {
    return (await this.ds.getGroupStats(params)).toEntity()
  }

  async getUserBreakdown(params: AdminDashboardUserBreakdownRequest): Promise<UserBreakdownResponse> {
    return (await this.ds.getUserBreakdown(params)).toEntity()
  }

  async getSnapshotV2(params?: AdminDashboardSnapshotV2Request): Promise<unknown> {
    return this.ds.getSnapshotV2(params)
  }

  async getApiKeyUsageTrend(params?: AdminDashboardApiKeyTrendRequest): Promise<ApiKeyTrendResponse> {
    return (await this.ds.getApiKeyUsageTrend(params)).toEntity()
  }

  async getUserUsageTrend(params?: AdminDashboardUserTrendRequest): Promise<UserTrendResponse> {
    return (await this.ds.getUserUsageTrend(params)).toEntity()
  }

  async getUserSpendingRanking(params?: AdminDashboardUserSpendingRankingRequest): Promise<UserSpendingRankingResponse> {
    return (await this.ds.getUserSpendingRanking(params)).toEntity()
  }

  async getBatchUsersUsage(req: AdminDashboardBatchUsersUsageRequest): Promise<BatchUsersUsageResponse> {
    return (await this.ds.getBatchUsersUsage(req)).toEntity()
  }

  async getBatchApiKeysUsage(req: AdminDashboardBatchApiKeysUsageRequest): Promise<BatchApiKeysUsageResponse> {
    return (await this.ds.getBatchApiKeysUsage(req)).toEntity()
  }
}

export const adminDashboardQueryRepository: AdminDashboardQueryRepository = new AdminDashboardQueryRepositoryImpl()
