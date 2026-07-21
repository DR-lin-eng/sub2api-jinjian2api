/**
 * AdminGroupsRepository (interface). Auto-generated from adminGroupsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminGroupsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-groups/data/datasources/adminGroupsDatasource'

export type AdminGroupsRepository = {
  list: typeof ds.list
  getAll: typeof ds.getAll
  getAllIncludingInactive: typeof ds.getAllIncludingInactive
  getByPlatform: typeof ds.getByPlatform
  getById: typeof ds.getById
  getModelsListCandidates: typeof ds.getModelsListCandidates
  create: typeof ds.create
  duplicate: typeof ds.duplicate
  update: typeof ds.update
  deleteGroup: typeof ds.deleteGroup
  toggleStatus: typeof ds.toggleStatus
  getStats: typeof ds.getStats
  getGroupApiKeys: typeof ds.getGroupApiKeys
  listCompositeRoutes: typeof ds.listCompositeRoutes
  createCompositeRoute: typeof ds.createCompositeRoute
  updateCompositeRoute: typeof ds.updateCompositeRoute
  deleteCompositeRoute: typeof ds.deleteCompositeRoute
  previewCompositeRoute: typeof ds.previewCompositeRoute
  getGroupRateMultipliers: typeof ds.getGroupRateMultipliers
  updateSortOrder: typeof ds.updateSortOrder
  clearGroupRateMultipliers: typeof ds.clearGroupRateMultipliers
  batchSetGroupRateMultipliers: typeof ds.batchSetGroupRateMultipliers
  getGroupRPMOverrides: typeof ds.getGroupRPMOverrides
  batchSetGroupRPMOverrides: typeof ds.batchSetGroupRPMOverrides
  clearGroupRPMOverrides: typeof ds.clearGroupRPMOverrides
  getUsageSummary: typeof ds.getUsageSummary
  getCapacitySummary: typeof ds.getCapacitySummary
}
