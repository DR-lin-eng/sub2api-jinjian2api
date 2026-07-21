/**
 * UsageRepository (interface). Auto-generated from usageDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/usageRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/usage/data/datasources/usageDatasource'

export type UsageRepository = {
  list: typeof ds.list
  query: typeof ds.query
  getStats: typeof ds.getStats
  getStatsByDateRange: typeof ds.getStatsByDateRange
  getByDateRange: typeof ds.getByDateRange
  getById: typeof ds.getById
  getDashboardStats: typeof ds.getDashboardStats
  getDashboardTrend: typeof ds.getDashboardTrend
  getDashboardModels: typeof ds.getDashboardModels
  getMyApiKeyDailyUsage: typeof ds.getMyApiKeyDailyUsage
  getDashboardSnapshotV2: typeof ds.getDashboardSnapshotV2
  getDashboardApiKeysUsage: typeof ds.getDashboardApiKeysUsage
  listMyErrorRequests: typeof ds.listMyErrorRequests
  getMyErrorDetail: typeof ds.getMyErrorDetail
}
