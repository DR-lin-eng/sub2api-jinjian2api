import { apiClient } from '@/core/networks/client'
import { DashboardStatsDto } from '@/features/admin-dashboard/data/models/dashboardStatsDto'
import { DashboardRealtimeMetricsDto } from '@/features/admin-dashboard/data/models/dashboardRealtimeMetricsDto'
import { TrendResponseDto } from '@/features/admin-dashboard/data/models/trendResponseDto'
import { ModelStatsResponseDto } from '@/features/admin-dashboard/data/models/modelStatsResponseDto'
import { GroupStatsResponseDto } from '@/features/admin-dashboard/data/models/groupStatsResponseDto'
import { UserBreakdownResponseDto } from '@/features/admin-dashboard/data/models/userBreakdownResponseDto'
import { ApiKeyTrendResponseDto } from '@/features/admin-dashboard/data/models/apiKeyTrendResponseDto'
import { UserTrendResponseDto } from '@/features/admin-dashboard/data/models/userTrendResponseDto'
import { UserSpendingRankingResponseDto } from '@/features/admin-dashboard/data/models/userSpendingRankingResponseDto'
import { BatchUsersUsageResponseDto } from '@/features/admin-dashboard/data/models/batchUsersUsageResponseDto'
import { BatchApiKeysUsageResponseDto } from '@/features/admin-dashboard/data/models/batchApiKeysUsageResponseDto'
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

export class AdminDashboardQueryDatasource {
  async getStats(): Promise<DashboardStatsDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/stats')
    return DashboardStatsDto.fromJson(data)
  }

  async getRealtimeMetrics(): Promise<DashboardRealtimeMetricsDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/realtime')
    return DashboardRealtimeMetricsDto.fromJson(data)
  }

  async getUsageTrend(params?: AdminDashboardTrendRequest): Promise<TrendResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/trend', { params })
    return TrendResponseDto.fromJson(data)
  }

  async getModelStats(params?: AdminDashboardModelStatsRequest): Promise<ModelStatsResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/models', { params })
    return ModelStatsResponseDto.fromJson(data)
  }

  async getGroupStats(params?: AdminDashboardGroupStatsRequest): Promise<GroupStatsResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/groups', { params })
    return GroupStatsResponseDto.fromJson(data)
  }

  async getUserBreakdown(params: AdminDashboardUserBreakdownRequest): Promise<UserBreakdownResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/user-breakdown', { params })
    return UserBreakdownResponseDto.fromJson(data)
  }

  async getSnapshotV2(params?: AdminDashboardSnapshotV2Request): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/snapshot-v2', { params })
    return data
  }

  async getApiKeyUsageTrend(params?: AdminDashboardApiKeyTrendRequest): Promise<ApiKeyTrendResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/api-keys-trend', { params })
    return ApiKeyTrendResponseDto.fromJson(data)
  }

  async getUserUsageTrend(params?: AdminDashboardUserTrendRequest): Promise<UserTrendResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/users-trend', { params })
    return UserTrendResponseDto.fromJson(data)
  }

  async getUserSpendingRanking(params?: AdminDashboardUserSpendingRankingRequest): Promise<UserSpendingRankingResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/dashboard/users-ranking', { params })
    return UserSpendingRankingResponseDto.fromJson(data)
  }

  async getBatchUsersUsage(req: AdminDashboardBatchUsersUsageRequest): Promise<BatchUsersUsageResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/dashboard/users-usage', req)
    return BatchUsersUsageResponseDto.fromJson(data)
  }

  async getBatchApiKeysUsage(req: AdminDashboardBatchApiKeysUsageRequest): Promise<BatchApiKeysUsageResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/dashboard/api-keys-usage', req)
    return BatchApiKeysUsageResponseDto.fromJson(data)
  }
}

export const adminDashboardQueryDatasource = new AdminDashboardQueryDatasource()
