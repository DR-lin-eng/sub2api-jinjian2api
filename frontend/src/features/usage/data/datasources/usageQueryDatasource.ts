import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/types'
import type { UsageLog } from '@/core/models/domain/usageLog'
import type { UsageQueryParams } from '@/features/admin-usage/domain/models/adminUsageQueryParams'
import type { UsageStatsResponse } from '@/core/models/domain/usageStatsResponse'
import { UserDashboardStatsDto } from '@/features/usage/data/models/userDashboardStatsDto'
import { TrendResponseDto } from '@/features/admin-dashboard/data/models/trendResponseDto'
import { ModelStatsResponseDto } from '@/features/admin-dashboard/data/models/modelStatsResponseDto'
import { ApiKeyDailyUsageResponseDto } from '@/features/usage/data/models/apiKeyDailyUsageResponseDto'
import { UsageDashboardSnapshotV2ResponseDto } from '@/features/usage/data/models/usageDashboardSnapshotV2ResponseDto'
import { BatchApiKeysUsageResponseDto } from '@/features/usage/data/models/batchApiKeysUsageResponseDto'
import type { UserErrorRequest, UserErrorRequestDetail, UserErrorListParams } from '@/features/admin-ops/domain/models/userErrorTypes'
import type { UsageTrendParams } from '@/features/usage/data/requests_models/usageTrendParams'
import type { UsageDashboardSnapshotV2Params } from '@/features/usage/data/requests_models/usageDashboardSnapshotV2Params'
import type { UsageDashboardApiKeysUsageRequest } from '@/features/usage/data/requests_models/usageDashboardApiKeysUsageRequest'

export class UsageQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    apiKeyId?: number,
  ): Promise<PaginatedResponse<UsageLog>> {
    const params: Record<string, unknown> = { page, pageSize }
    if (apiKeyId !== undefined) params.apiKeyId = apiKeyId
    const { data } = await apiClient.get<PaginatedResponse<UsageLog>>('/usage', { params })
    return data
  }

  async query(
    params: UsageQueryParams & { sort_by?: string; sort_order?: 'asc' | 'desc' },
    config: { signal?: AbortSignal } = {},
  ): Promise<PaginatedResponse<UsageLog>> {
    const { data } = await apiClient.get<PaginatedResponse<UsageLog>>('/usage', { ...config, params })
    return data
  }

  async getStats(
    paramsOrPeriod: (UsageQueryParams & { period?: string; timezone?: string }) | string = 'today',
    apiKeyId?: number,
  ): Promise<UsageStatsResponse> {
    const params: Record<string, unknown> = typeof paramsOrPeriod === 'string'
      ? { period: paramsOrPeriod }
      : { ...paramsOrPeriod }
    if (apiKeyId !== undefined) params.api_key_id = apiKeyId
    const { data } = await apiClient.get<UsageStatsResponse>('/usage/stats', { params })
    return data
  }

  async getStatsByDateRange(
    startDate: string,
    endDate: string,
    apiKeyId?: number,
  ): Promise<UsageStatsResponse> {
    const params: Record<string, unknown> = { start_date: startDate, end_date: endDate }
    if (apiKeyId !== undefined) params.api_key_id = apiKeyId
    const { data } = await apiClient.get<UsageStatsResponse>('/usage/stats', { params })
    return data
  }

  async getByDateRange(
    startDate: string,
    endDate: string,
    apiKeyId?: number,
  ): Promise<PaginatedResponse<UsageLog>> {
    const params: Record<string, unknown> = { startDate, endDate, page: 1, pageSize: 100 }
    if (apiKeyId !== undefined) params.apiKeyId = apiKeyId
    const { data } = await apiClient.get<PaginatedResponse<UsageLog>>('/usage', { params })
    return data
  }

  async getById(id: number): Promise<UsageLog> {
    const { data } = await apiClient.get<UsageLog>(`/usage/${id}`)
    return data
  }

  async getDashboardStats(): Promise<UserDashboardStatsDto> {
    const { data } = await apiClient.get<unknown>('/usage/dashboard/stats')
    return UserDashboardStatsDto.fromJson(data)
  }

  async getDashboardTrend(params?: UsageTrendParams): Promise<TrendResponseDto> {
    const { data } = await apiClient.get<unknown>('/usage/dashboard/trend', { params })
    return TrendResponseDto.fromJson(data)
  }

  async getDashboardModels(params?: UsageTrendParams & { model_source?: 'requested' }): Promise<ModelStatsResponseDto> {
    const { data } = await apiClient.get<unknown>('/usage/dashboard/models', { params })
    return ModelStatsResponseDto.fromJson(data)
  }

  async getMyApiKeyDailyUsage(apiKeyId: number, days: number = 30): Promise<ApiKeyDailyUsageResponseDto> {
    const { data } = await apiClient.get<unknown>(
      `/user/api-keys/${apiKeyId}/usage/daily`,
      { params: { days } },
    )
    return ApiKeyDailyUsageResponseDto.fromJson(data)
  }

  async getDashboardSnapshotV2(params?: UsageDashboardSnapshotV2Params): Promise<UsageDashboardSnapshotV2ResponseDto> {
    const { data } = await apiClient.get<unknown>('/usage/dashboard/snapshot-v2', { params })
    return UsageDashboardSnapshotV2ResponseDto.fromJson(data)
  }

  async getDashboardApiKeysUsage(
    req: UsageDashboardApiKeysUsageRequest,
    options?: { signal?: AbortSignal },
  ): Promise<BatchApiKeysUsageResponseDto> {
    const { data } = await apiClient.post<unknown>(
      '/usage/dashboard/api-keys-usage',
      { ...req, timezone: req.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone },
      { signal: options?.signal },
    )
    return BatchApiKeysUsageResponseDto.fromJson(data)
  }

  async listMyErrorRequests(params: UserErrorListParams): Promise<PaginatedResponse<UserErrorRequest>> {
    const { data } = await apiClient.get<PaginatedResponse<UserErrorRequest>>('/usage/errors', { params })
    return data
  }

  async getMyErrorDetail(id: number): Promise<UserErrorRequestDetail> {
    const { data } = await apiClient.get<UserErrorRequestDetail>(`/usage/errors/${id}`)
    return data
  }
}

export const usageQueryDatasource = new UsageQueryDatasource()
