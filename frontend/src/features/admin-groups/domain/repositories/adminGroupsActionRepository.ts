import type { AdminGroup } from '@/features/admin-groups/domain/models/adminGroup'
import type { CompositeModelRoute } from '@/features/admin-groups/domain/models/compositeModelRoute'
import type { CreateGroupRequest } from '@/features/admin-groups/data/requests_models/createGroupRequest'
import type { UpdateGroupRequest } from '@/features/admin-groups/data/requests_models/updateGroupRequest'
import type { CreateCompositeRouteRequest } from '@/features/admin-groups/data/requests_models/createCompositeRouteRequest'

export interface AdminGroupsActionRepository {
  create(req: CreateGroupRequest): Promise<AdminGroup>
  duplicate(id: number): Promise<AdminGroup>
  update(id: number, req: UpdateGroupRequest): Promise<AdminGroup>
  deleteGroup(id: number): Promise<{ message: string }>
  toggleStatus(id: number, status: 'active' | 'inactive'): Promise<AdminGroup>
  createCompositeRoute(id: number, route: CreateCompositeRouteRequest): Promise<CompositeModelRoute>
  updateCompositeRoute(id: number, routeId: number, route: CreateCompositeRouteRequest): Promise<CompositeModelRoute>
  deleteCompositeRoute(id: number, routeId: number): Promise<{ message: string }>
  updateSortOrder(updates: Array<{ id: number; sort_order: number }>): Promise<{ message: string }>
  clearGroupRateMultipliers(id: number): Promise<{ message: string }>
  batchSetGroupRateMultipliers(id: number, entries: Array<{ user_id: number; rate_multiplier: number }>): Promise<{ message: string }>
  batchSetGroupRPMOverrides(id: number, entries: Array<{ user_id: number; rpm_override: number }>): Promise<{ message: string }>
  clearGroupRPMOverrides(id: number): Promise<{ message: string }>
}
