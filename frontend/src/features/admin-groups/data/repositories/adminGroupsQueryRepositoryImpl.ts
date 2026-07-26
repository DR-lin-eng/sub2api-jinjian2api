import { adminGroupsQueryDatasource } from '@/features/admin-groups/data/datasources/adminGroupsQueryDatasource'
import type { AdminGroupsQueryRepository } from '@/features/admin-groups/domain/repositories/adminGroupsQueryRepository'
import type { AdminGroup } from '@/features/admin-groups/domain/models/adminGroup'
import type { CompositeModelRoute } from '@/features/admin-groups/domain/models/compositeModelRoute'
import type { CompositeRouteDecision } from '@/features/admin-groups/domain/models/compositeRouteDecision'
import type { GroupRateMultiplier } from '@/features/admin-groups/domain/models/groupRateMultiplier'
import type { GroupRPMOverride } from '@/features/admin-groups/domain/models/groupRPMOverride'
import type { GroupPlatform } from '@/core/enums/groupPlatform'
import type { PreviewCompositeRouteRequest } from '@/features/admin-groups/data/requests_models/previewCompositeRouteRequest'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

export class AdminGroupsQueryRepositoryImpl implements AdminGroupsQueryRepository {
  private readonly ds = adminGroupsQueryDatasource

  list = async (
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
  ): Promise<PaginatedResponse<AdminGroup>> => {
    const result = await this.ds.list(page, pageSize, filters, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getAll = async (platform?: GroupPlatform) : Promise<AdminGroup[]>  => {
    const dtos = await this.ds.getAll(platform)
    return dtos.map(dto => dto.toEntity())
  }

  getAllIncludingInactive = async () : Promise<AdminGroup[]>  => {
    const dtos = await this.ds.getAllIncludingInactive()
    return dtos.map(dto => dto.toEntity())
  }

  getByPlatform = async (platform: GroupPlatform) : Promise<AdminGroup[]>  => {
    const dtos = await this.ds.getByPlatform(platform)
    return dtos.map(dto => dto.toEntity())
  }

  getById = async (id: number) : Promise<AdminGroup>  => {
    return (await this.ds.getById(id)).toEntity()
  }

  getModelsListCandidates = async (id: number, platform?: GroupPlatform) : Promise<string[]>  => {
    return this.ds.getModelsListCandidates(id, platform)
  }

  async getStats(id: number): Promise<{
    total_api_keys: number
    active_api_keys: number
    total_requests: number
    total_cost: number
  }> {
    return this.ds.getStats(id)
  }

  getGroupApiKeys = async (id: number, page?: number, pageSize?: number) : Promise<PaginatedResponse<unknown>>  => {
    return this.ds.getGroupApiKeys(id, page, pageSize)
  }

  listCompositeRoutes = async (id: number) : Promise<CompositeModelRoute[]>  => {
    const dtos = await this.ds.listCompositeRoutes(id)
    return dtos.map(dto => dto.toEntity())
  }

  previewCompositeRoute = async (id: number, request: PreviewCompositeRouteRequest) : Promise<CompositeRouteDecision>  => {
    return (await this.ds.previewCompositeRoute(id, request)).toEntity()
  }

  getGroupRateMultipliers = async (id: number) : Promise<GroupRateMultiplier[]>  => {
    return (await this.ds.getGroupRateMultipliers(id)).map(dto => dto.toEntity())
  }

  getGroupRPMOverrides = async (id: number) : Promise<GroupRPMOverride[]>  => {
    return (await this.ds.getGroupRPMOverrides(id)).map(dto => dto.toEntity())
  }

  getUsageSummary = async (timezone?: string) : Promise<{ group_id: number; today_cost: number; total_cost: number }[]>  => {
    return this.ds.getUsageSummary(timezone)
  }

  getCapacitySummary = async () : Promise<{ group_id: number; concurrency_used: number; concurrency_max: number; sessions_used: number; sessions_max: number; rpm_used: number; rpm_max: number }[]>  => {
    return this.ds.getCapacitySummary()
  }
}

export const adminGroupsQueryRepository: AdminGroupsQueryRepository = new AdminGroupsQueryRepositoryImpl()
