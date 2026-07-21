/**
 * AdminGroupsRepositoryImpl. Auto-generated from adminGroupsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-groups/data/datasources/adminGroupsDatasource'
import type { AdminGroupsRepository } from '@/features/admin-groups/domain/repositories/adminGroupsRepository'

export class AdminGroupsRepositoryImpl implements AdminGroupsRepository {
  list = ds.list
  getAll = ds.getAll
  getAllIncludingInactive = ds.getAllIncludingInactive
  getByPlatform = ds.getByPlatform
  getById = ds.getById
  getModelsListCandidates = ds.getModelsListCandidates
  create = ds.create
  duplicate = ds.duplicate
  update = ds.update
  deleteGroup = ds.deleteGroup
  toggleStatus = ds.toggleStatus
  getStats = ds.getStats
  getGroupApiKeys = ds.getGroupApiKeys
  listCompositeRoutes = ds.listCompositeRoutes
  createCompositeRoute = ds.createCompositeRoute
  updateCompositeRoute = ds.updateCompositeRoute
  deleteCompositeRoute = ds.deleteCompositeRoute
  previewCompositeRoute = ds.previewCompositeRoute
  getGroupRateMultipliers = ds.getGroupRateMultipliers
  updateSortOrder = ds.updateSortOrder
  clearGroupRateMultipliers = ds.clearGroupRateMultipliers
  batchSetGroupRateMultipliers = ds.batchSetGroupRateMultipliers
  getGroupRPMOverrides = ds.getGroupRPMOverrides
  batchSetGroupRPMOverrides = ds.batchSetGroupRPMOverrides
  clearGroupRPMOverrides = ds.clearGroupRPMOverrides
  getUsageSummary = ds.getUsageSummary
  getCapacitySummary = ds.getCapacitySummary
}

export const adminGroupsRepository: AdminGroupsRepository = new AdminGroupsRepositoryImpl()
