import type { AdminGroup } from '@/features/admin-groups/domain/models/adminGroup'
import type { CompositeModelRoute } from '@/features/admin-groups/domain/models/compositeModelRoute'
import type { CompositeRouteDecision } from '@/features/admin-groups/domain/models/compositeRouteDecision'
import type { GroupRateMultiplier } from '@/features/admin-groups/domain/models/groupRateMultiplier'
import type { GroupRPMOverride } from '@/features/admin-groups/domain/models/groupRPMOverride'
import type { GroupPlatform } from '@/core/enums/groupPlatform'
import type { PreviewCompositeRouteRequest } from '@/features/admin-groups/data/requests_models/previewCompositeRouteRequest'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

export interface AdminGroupsQueryRepository {
  list(
    page: number,
    pageSize: number,
    filters?: {
      platform?: GroupPlatform
      status?: 'active' | 'inactive'
      is_exclusive?: boolean
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AdminGroup>>
  getAll(platform?: GroupPlatform): Promise<AdminGroup[]>
  getAllIncludingInactive(): Promise<AdminGroup[]>
  getByPlatform(platform: GroupPlatform): Promise<AdminGroup[]>
  getById(id: number): Promise<AdminGroup>
  getModelsListCandidates(id: number, platform?: GroupPlatform): Promise<string[]>
  getStats(id: number): Promise<{
    total_api_keys: number
    active_api_keys: number
    total_requests: number
    total_cost: number
  }>
  getGroupApiKeys(id: number, page?: number, pageSize?: number): Promise<PaginatedResponse<unknown>>
  listCompositeRoutes(id: number): Promise<CompositeModelRoute[]>
  previewCompositeRoute(id: number, request: PreviewCompositeRouteRequest): Promise<CompositeRouteDecision>
  getGroupRateMultipliers(id: number): Promise<GroupRateMultiplier[]>
  getGroupRPMOverrides(id: number): Promise<GroupRPMOverride[]>
  getUsageSummary(timezone?: string): Promise<{ group_id: number; today_cost: number; total_cost: number }[]>
  getCapacitySummary(): Promise<{ group_id: number; concurrency_used: number; concurrency_max: number; sessions_used: number; sessions_max: number; rpm_used: number; rpm_max: number }[]>
}
