/**
 * AdminGroupsRepository (interface). Auto-generated from adminGroupsDatasource.ts.
 */
import type * as ds from '@/features/admin-groups/data/datasources/adminGroupsDatasource'

export type AdminGroupsRepository = {
  readonly list: typeof ds.list
  readonly getAll: typeof ds.getAll
  readonly getAllIncludingInactive: typeof ds.getAllIncludingInactive
  readonly getByPlatform: typeof ds.getByPlatform
  readonly getById: typeof ds.getById
  readonly getModelsListCandidates: typeof ds.getModelsListCandidates
  readonly create: typeof ds.create
  readonly duplicate: typeof ds.duplicate
  readonly update: typeof ds.update
  readonly deleteGroup: typeof ds.deleteGroup
  readonly toggleStatus: typeof ds.toggleStatus
  readonly getStats: typeof ds.getStats
  readonly getGroupApiKeys: typeof ds.getGroupApiKeys
  readonly listCompositeRoutes: typeof ds.listCompositeRoutes
  readonly createCompositeRoute: typeof ds.createCompositeRoute
  readonly updateCompositeRoute: typeof ds.updateCompositeRoute
  readonly deleteCompositeRoute: typeof ds.deleteCompositeRoute
  readonly previewCompositeRoute: typeof ds.previewCompositeRoute
  readonly getGroupRateMultipliers: typeof ds.getGroupRateMultipliers
  readonly updateSortOrder: typeof ds.updateSortOrder
  readonly clearGroupRateMultipliers: typeof ds.clearGroupRateMultipliers
  readonly batchSetGroupRateMultipliers: typeof ds.batchSetGroupRateMultipliers
  readonly getGroupRPMOverrides: typeof ds.getGroupRPMOverrides
  readonly batchSetGroupRPMOverrides: typeof ds.batchSetGroupRPMOverrides
  readonly clearGroupRPMOverrides: typeof ds.clearGroupRPMOverrides
  readonly getUsageSummary: typeof ds.getUsageSummary
  readonly getCapacitySummary: typeof ds.getCapacitySummary
}
