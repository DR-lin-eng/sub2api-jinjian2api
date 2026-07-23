import { adminGroupsActionDatasource } from '@/features/admin-groups/data/datasources/adminGroupsActionDatasource'
import type { AdminGroupsActionRepository } from '@/features/admin-groups/domain/repositories/adminGroupsActionRepository'
import type { AdminGroup } from '@/features/admin-groups/domain/models/adminGroup'
import type { CompositeModelRoute } from '@/features/admin-groups/domain/models/compositeModelRoute'
import type { CreateGroupRequest } from '@/features/admin-groups/data/requests_models/createGroupRequest'
import type { UpdateGroupRequest } from '@/features/admin-groups/data/requests_models/updateGroupRequest'
import type { CreateCompositeRouteRequest } from '@/features/admin-groups/data/requests_models/createCompositeRouteRequest'

export class AdminGroupsActionRepositoryImpl implements AdminGroupsActionRepository {
  private readonly ds = adminGroupsActionDatasource

  async create(req: CreateGroupRequest): Promise<AdminGroup> {
    return (await this.ds.create(req)).toEntity()
  }

  async duplicate(id: number): Promise<AdminGroup> {
    return (await this.ds.duplicate(id)).toEntity()
  }

  async update(id: number, req: UpdateGroupRequest): Promise<AdminGroup> {
    return (await this.ds.update(id, req)).toEntity()
  }

  async deleteGroup(id: number): Promise<{ message: string }> {
    return this.ds.deleteGroup(id)
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<AdminGroup> {
    return (await this.ds.toggleStatus(id, status)).toEntity()
  }

  async createCompositeRoute(id: number, route: CreateCompositeRouteRequest): Promise<CompositeModelRoute> {
    return (await this.ds.createCompositeRoute(id, route)).toEntity()
  }

  async updateCompositeRoute(id: number, routeId: number, route: CreateCompositeRouteRequest): Promise<CompositeModelRoute> {
    return (await this.ds.updateCompositeRoute(id, routeId, route)).toEntity()
  }

  async deleteCompositeRoute(id: number, routeId: number): Promise<{ message: string }> {
    return this.ds.deleteCompositeRoute(id, routeId)
  }

  async updateSortOrder(updates: Array<{ id: number; sort_order: number }>): Promise<{ message: string }> {
    return this.ds.updateSortOrder(updates)
  }

  async clearGroupRateMultipliers(id: number): Promise<{ message: string }> {
    return this.ds.clearGroupRateMultipliers(id)
  }

  async batchSetGroupRateMultipliers(
    id: number,
    entries: Array<{ user_id: number; rate_multiplier: number }>,
  ): Promise<{ message: string }> {
    return this.ds.batchSetGroupRateMultipliers(id, entries)
  }

  async batchSetGroupRPMOverrides(
    id: number,
    entries: Array<{ user_id: number; rpm_override: number }>,
  ): Promise<{ message: string }> {
    return this.ds.batchSetGroupRPMOverrides(id, entries)
  }

  async clearGroupRPMOverrides(id: number): Promise<{ message: string }> {
    return this.ds.clearGroupRPMOverrides(id)
  }
}

export const adminGroupsActionRepository: AdminGroupsActionRepository = new AdminGroupsActionRepositoryImpl()
