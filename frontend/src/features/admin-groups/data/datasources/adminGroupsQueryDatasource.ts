import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AdminGroupDto } from '@/features/admin-groups/data/models/adminGroupDto'
import { CompositeModelRouteDto } from '@/features/admin-groups/data/models/compositeModelRouteDto'
import { CompositeRouteDecisionDto } from '@/features/admin-groups/data/models/compositeRouteDecisionDto'
import { GroupRateMultiplierDto } from '@/features/admin-groups/data/models/groupRateMultiplierDto'
import { GroupRPMOverrideDto } from '@/features/admin-groups/data/models/groupRPMOverrideDto'
import type { GroupPlatform } from '@/core/enums/groupPlatform'
import type { PreviewCompositeRouteRequest } from '@/features/admin-groups/data/requests_models/previewCompositeRouteRequest'

export class AdminGroupsQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      platform?: GroupPlatform
      status?: 'active' | 'inactive'
      is_exclusive?: boolean
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AdminGroupDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/groups', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => AdminGroupDto.fromJson(item)) }
  }

  async getAll(platform?: GroupPlatform): Promise<AdminGroupDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/groups/all', {
      params: platform ? { platform } : undefined,
    })
    return (data ?? []).map(item => AdminGroupDto.fromJson(item))
  }

  async getAllIncludingInactive(): Promise<AdminGroupDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/groups/all', {
      params: { include_inactive: true },
    })
    return (data ?? []).map(item => AdminGroupDto.fromJson(item))
  }

  async getByPlatform(platform: GroupPlatform): Promise<AdminGroupDto[]> {
    return this.getAll(platform)
  }

  async getById(id: number): Promise<AdminGroupDto> {
    const { data } = await apiClient.get<unknown>(`/admin/groups/${id}`)
    return AdminGroupDto.fromJson(data)
  }

  async getModelsListCandidates(id: number, platform?: GroupPlatform): Promise<string[]> {
    const { data } = await apiClient.get<{ models: string[] }>(
      `/admin/groups/${id}/models-list-candidates`,
      { params: platform ? { platform } : undefined },
    )
    return data.models ?? []
  }

  async getStats(id: number): Promise<{
    total_api_keys: number
    active_api_keys: number
    total_requests: number
    total_cost: number
  }> {
    const { data } = await apiClient.get<{
      total_api_keys: number
      active_api_keys: number
      total_requests: number
      total_cost: number
    }>(`/admin/groups/${id}/stats`)
    return data
  }

  async getGroupApiKeys(id: number, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<unknown>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(`/admin/groups/${id}/api-keys`, {
      params: { page, page_size: pageSize },
    })
    return data
  }

  async listCompositeRoutes(id: number): Promise<CompositeModelRouteDto[]> {
    const { data } = await apiClient.get<unknown[]>(`/admin/groups/${id}/composite-routes`)
    return (data ?? []).map(item => CompositeModelRouteDto.fromJson(item))
  }

  async previewCompositeRoute(id: number, request: PreviewCompositeRouteRequest): Promise<CompositeRouteDecisionDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/groups/${id}/composite-routes/preview`,
      request,
    )
    return CompositeRouteDecisionDto.fromJson(data)
  }

  async getGroupRateMultipliers(id: number): Promise<GroupRateMultiplierDto[]> {
    const { data } = await apiClient.get<unknown[]>(`/admin/groups/${id}/rate-multipliers`)
    return data.map(item => GroupRateMultiplierDto.fromJson(item))
  }

  async getGroupRPMOverrides(id: number): Promise<GroupRPMOverrideDto[]> {
    const { data } = await apiClient.get<unknown[]>(`/admin/groups/${id}/rate-multipliers`)
    return data
      .filter((e: any) => e.rpm_override != null)
      .map(item => GroupRPMOverrideDto.fromJson(item))
  }

  async getUsageSummary(
    timezone?: string,
  ): Promise<{ group_id: number; today_cost: number; total_cost: number }[]> {
    const { data } = await apiClient.get<{ group_id: number; today_cost: number; total_cost: number }[]>(
      '/admin/groups/usage-summary',
      { params: timezone ? { timezone } : undefined },
    )
    return data
  }

  async getCapacitySummary(): Promise<
    { group_id: number; concurrency_used: number; concurrency_max: number; sessions_used: number; sessions_max: number; rpm_used: number; rpm_max: number }[]
  > {
    const { data } = await apiClient.get<
      { group_id: number; concurrency_used: number; concurrency_max: number; sessions_used: number; sessions_max: number; rpm_used: number; rpm_max: number }[]
    >('/admin/groups/capacity-summary')
    return data
  }
}

export const adminGroupsQueryDatasource = new AdminGroupsQueryDatasource()
