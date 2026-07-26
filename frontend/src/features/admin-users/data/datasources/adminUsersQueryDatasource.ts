import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AdminUserDto } from '@/features/admin-users/data/models/adminUserDto'
import { AdminUserUsageStatsDto } from '@/features/admin-users/data/models/adminUserUsageStatsDto'
import { BalanceHistoryItemDto } from '@/features/admin-users/data/models/balanceHistoryItemDto'
import { PlatformQuotaItemDto } from '@/features/admin-users/data/models/platformQuotaItemDto'
import { ApiKeyDto } from '@/core/models/data/apiKeyDto'

export class AdminUsersQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      status?: 'active' | 'disabled'
      role?: 'admin' | 'user'
      search?: string
      group_name?: string
      api_key_group_id?: number
      attributes?: Record<number, string>
      include_subscriptions?: boolean
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal }
  ): Promise<PaginatedResponse<AdminUserDto>> {
    const params: Record<string, unknown> = {
      page,
      page_size: pageSize,
      status: filters?.status,
      role: filters?.role,
      search: filters?.search,
      group_name: filters?.group_name,
      api_key_group_id: filters?.api_key_group_id,
      include_subscriptions: filters?.include_subscriptions,
      sort_by: filters?.sort_by,
      sort_order: filters?.sort_order,
    }
    if (filters?.attributes) {
      for (const [attrId, value] of Object.entries(filters.attributes)) {
        if (value) params[`attr[${attrId}]`] = value
      }
    }
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/users', {
      params,
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => AdminUserDto.fromJson(item)) }
  }

  async getById(id: number, includeDeleted = false): Promise<AdminUserDto> {
    const url = includeDeleted ? `/admin/users/${id}?include_deleted=true` : `/admin/users/${id}`
    const { data } = await apiClient.get<unknown>(url)
    return AdminUserDto.fromJson(data)
  }

  async getUserApiKeys(id: number): Promise<PaginatedResponse<ApiKeyDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(`/admin/users/${id}/api-keys`)
    return { ...data, items: (data.items ?? []).map(item => ApiKeyDto.fromJson(item)) }
  }

  async getUserUsageStats(id: number, period: string = 'month'): Promise<AdminUserUsageStatsDto> {
    const { data } = await apiClient.get<unknown>(`/admin/users/${id}/usage`, {
      params: { period },
    })
    return AdminUserUsageStatsDto.fromJson(data)
  }

  async getUserBalanceHistory(
    id: number,
    page: number = 1,
    pageSize: number = 20,
    type?: string
  ): Promise<{ items: BalanceHistoryItemDto[]; total: number; page: number; pageSize: number; pages: number; totalRecharged: number }> {
    const params: Record<string, unknown> = { page, page_size: pageSize }
    if (type) params.type = type
    const { data } = await apiClient.get<{
      items: unknown[]
      total: number
      page: number
      page_size: number
      pages: number
      total_recharged: number
    }>(`/admin/users/${id}/balance-history`, { params })
    return {
      items: (data.items ?? []).map(item => BalanceHistoryItemDto.fromJson(item)),
      total: data.total ?? 0,
      page: data.page ?? page,
      pageSize: data.page_size ?? pageSize,
      pages: data.pages ?? 0,
      totalRecharged: data.total_recharged ?? 0,
    }
  }

  async getPlatformQuotas(id: number): Promise<PlatformQuotaItemDto[]> {
    const { data } = await apiClient.get<{ platform_quotas: unknown[] }>(
      `/admin/users/${id}/platform-quotas`
    )
    return (data.platform_quotas ?? []).map(item => PlatformQuotaItemDto.fromJson(item))
  }

  async getBatchPlatformQuotas(
    userIds: number[]
  ): Promise<Record<number, PlatformQuotaItemDto[]>> {
    const { data } = await apiClient.post<{ platform_quotas: Record<number, unknown[]> }>(
      '/admin/users/platform-quotas/batch',
      { user_ids: userIds }
    )
    const result: Record<number, PlatformQuotaItemDto[]> = {}
    for (const [userId, items] of Object.entries(data.platform_quotas ?? {})) {
      result[Number(userId)] = (items as unknown[]).map(item => PlatformQuotaItemDto.fromJson(item))
    }
    return result
  }
}

export const adminUsersQueryDatasource = new AdminUsersQueryDatasource()
