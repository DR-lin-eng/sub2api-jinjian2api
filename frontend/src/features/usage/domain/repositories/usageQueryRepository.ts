import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { UsageLog } from '@/core/models/domain/usageLog'
import type { AdminUsageQueryParams } from '@/features/admin-usage/domain/models/adminUsageQueryParams'
import type { UsageStatsResponse } from '@/core/models/domain/usageStatsResponse'
import type { UserDashboardStats } from '@/features/usage/domain/models/userDashboardStats'
import type { TrendResponse } from '@/features/admin-dashboard/domain/models/trendResponse'
import type { ModelStatsResponse } from '@/features/admin-dashboard/domain/models/modelStatsResponse'
import type { ApiKeyDailyUsageResponse } from '@/features/usage/domain/models/apiKeyDailyUsageResponse'
import type { UsageDashboardSnapshotV2Response } from '@/features/usage/domain/models/usageDashboardSnapshotV2Response'
import type { BatchApiKeysUsageResponse } from '@/features/usage/domain/models/batchApiKeysUsageResponse'
import type { UserErrorRequest } from '@/features/admin-ops/domain/models/userErrorRequest'
import type { UserErrorRequestDetail } from '@/features/admin-ops/domain/models/userErrorRequestDetail'
import type { UserErrorListParams } from '@/features/admin-ops/domain/models/userErrorListParams'
import type { UsageTrendParams } from '@/features/usage/data/requests_models/usageTrendParams'
import type { UsageDashboardSnapshotV2Params } from '@/features/usage/data/requests_models/usageDashboardSnapshotV2Params'
import type { UsageDashboardApiKeysUsageRequest } from '@/features/usage/data/requests_models/usageDashboardApiKeysUsageRequest'

export interface UsageQueryRepository {
  list(page?: number, pageSize?: number, apiKeyId?: number): Promise<PaginatedResponse<UsageLog>>
  query(params: AdminUsageQueryParams & { sort_by?: string; sort_order?: 'asc' | 'desc' }, config?: { signal?: AbortSignal }): Promise<PaginatedResponse<UsageLog>>
  getStats(paramsOrPeriod?: (AdminUsageQueryParams & { period?: string; timezone?: string }) | string, apiKeyId?: number): Promise<UsageStatsResponse>
  getStatsByDateRange(startDate: string, endDate: string, apiKeyId?: number): Promise<UsageStatsResponse>
  getByDateRange(startDate: string, endDate: string, apiKeyId?: number): Promise<PaginatedResponse<UsageLog>>
  getById(id: number): Promise<UsageLog>
  getDashboardStats(): Promise<UserDashboardStats>
  getDashboardTrend(params?: UsageTrendParams): Promise<TrendResponse>
  getDashboardModels(params?: UsageTrendParams & { model_source?: 'requested' }): Promise<ModelStatsResponse>
  getMyApiKeyDailyUsage(apiKeyId: number, days?: number): Promise<ApiKeyDailyUsageResponse>
  getDashboardSnapshotV2(params?: UsageDashboardSnapshotV2Params): Promise<UsageDashboardSnapshotV2Response>
  getDashboardApiKeysUsage(req: UsageDashboardApiKeysUsageRequest, options?: { signal?: AbortSignal }): Promise<BatchApiKeysUsageResponse>
  listMyErrorRequests(params: UserErrorListParams): Promise<PaginatedResponse<UserErrorRequest>>
  getMyErrorDetail(id: number): Promise<UserErrorRequestDetail>
}
