/**
 * AdminGroupsRepositoryImpl. Auto-generated from adminGroupsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-groups/data/datasources/adminGroupsDatasource'
import type { AdminGroupsRepository } from '@/features/admin-groups/domain/repositories/adminGroupsRepository'

export class AdminGroupsRepositoryImpl implements AdminGroupsRepository {
  get list(): typeof ds.list { return ds.list }
  get getAll(): typeof ds.getAll { return ds.getAll }
  get getAllIncludingInactive(): typeof ds.getAllIncludingInactive { return ds.getAllIncludingInactive }
  get getByPlatform(): typeof ds.getByPlatform { return ds.getByPlatform }
  get getById(): typeof ds.getById { return ds.getById }
  get getModelsListCandidates(): typeof ds.getModelsListCandidates { return ds.getModelsListCandidates }
  get create(): typeof ds.create { return ds.create }
  get duplicate(): typeof ds.duplicate { return ds.duplicate }
  get update(): typeof ds.update { return ds.update }
  get deleteGroup(): typeof ds.deleteGroup { return ds.deleteGroup }
  get toggleStatus(): typeof ds.toggleStatus { return ds.toggleStatus }
  get getStats(): typeof ds.getStats { return ds.getStats }
  get getGroupApiKeys(): typeof ds.getGroupApiKeys { return ds.getGroupApiKeys }
  get listCompositeRoutes(): typeof ds.listCompositeRoutes { return ds.listCompositeRoutes }
  get createCompositeRoute(): typeof ds.createCompositeRoute { return ds.createCompositeRoute }
  get updateCompositeRoute(): typeof ds.updateCompositeRoute { return ds.updateCompositeRoute }
  get deleteCompositeRoute(): typeof ds.deleteCompositeRoute { return ds.deleteCompositeRoute }
  get previewCompositeRoute(): typeof ds.previewCompositeRoute { return ds.previewCompositeRoute }
  get getGroupRateMultipliers(): typeof ds.getGroupRateMultipliers { return ds.getGroupRateMultipliers }
  get updateSortOrder(): typeof ds.updateSortOrder { return ds.updateSortOrder }
  get clearGroupRateMultipliers(): typeof ds.clearGroupRateMultipliers { return ds.clearGroupRateMultipliers }
  get batchSetGroupRateMultipliers(): typeof ds.batchSetGroupRateMultipliers { return ds.batchSetGroupRateMultipliers }
  get getGroupRPMOverrides(): typeof ds.getGroupRPMOverrides { return ds.getGroupRPMOverrides }
  get batchSetGroupRPMOverrides(): typeof ds.batchSetGroupRPMOverrides { return ds.batchSetGroupRPMOverrides }
  get clearGroupRPMOverrides(): typeof ds.clearGroupRPMOverrides { return ds.clearGroupRPMOverrides }
  get getUsageSummary(): typeof ds.getUsageSummary { return ds.getUsageSummary }
  get getCapacitySummary(): typeof ds.getCapacitySummary { return ds.getCapacitySummary }
}

export const adminGroupsRepository: AdminGroupsRepository = new AdminGroupsRepositoryImpl()
