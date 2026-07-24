import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AdminUsageLogDto } from '@/features/admin-usage/data/models/adminUsageLogDto'
import { AdminUsageStatsResponseDto } from '@/features/admin-usage/data/models/adminUsageStatsResponseDto'
import { SimpleUserDto } from '@/features/admin-usage/data/models/simpleUserDto'
import { SimpleApiKeyDto } from '@/features/admin-usage/data/models/simpleApiKeyDto'
import { UsageCleanupTaskDto } from '@/features/admin-usage/data/models/usageCleanupTaskDto'
import type { AdminUsageListRequest } from '@/features/admin-usage/data/requests_models/adminUsageListRequest'
import type { AdminUsageStatsRequest } from '@/features/admin-usage/data/requests_models/adminUsageStatsRequest'
import type { ListCleanupTasksRequest } from '@/features/admin-usage/data/requests_models/listCleanupTasksRequest'

export class AdminUsageQueryDatasource {
  async list(
    params: AdminUsageListRequest,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AdminUsageLogDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/usage', {
      params,
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => AdminUsageLogDto.fromJson(item)) }
  }

  async getStats(params: AdminUsageStatsRequest): Promise<AdminUsageStatsResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/usage/stats', { params })
    return AdminUsageStatsResponseDto.fromJson(data)
  }

  async searchUsers(keyword: string): Promise<SimpleUserDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/usage/search-users', {
      params: { q: keyword },
    })
    return data.map(item => SimpleUserDto.fromJson(item))
  }

  async searchApiKeys(userId?: number, keyword?: string): Promise<SimpleApiKeyDto[]> {
    const params: Record<string, unknown> = {}
    if (userId !== undefined) params.user_id = userId
    if (keyword) params.q = keyword
    const { data } = await apiClient.get<unknown[]>('/admin/usage/search-api-keys', { params })
    return data.map(item => SimpleApiKeyDto.fromJson(item))
  }

  async listCleanupTasks(
    params: ListCleanupTasksRequest,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<UsageCleanupTaskDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/usage/cleanup-tasks', {
      params,
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => UsageCleanupTaskDto.fromJson(item)) }
  }
}

export const adminUsageQueryDatasource = new AdminUsageQueryDatasource()
