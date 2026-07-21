/**
 * AdminDashboardRepository (interface). Auto-generated from adminDashboardDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminDashboardRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-dashboard/data/datasources/adminDashboardDatasource'

export type AdminDashboardRepository = {
  getStats: typeof ds.getStats
  getRealtimeMetrics: typeof ds.getRealtimeMetrics
  getUsageTrend: typeof ds.getUsageTrend
  getModelStats: typeof ds.getModelStats
  getGroupStats: typeof ds.getGroupStats
  getUserBreakdown: typeof ds.getUserBreakdown
  getSnapshotV2: typeof ds.getSnapshotV2
  getApiKeyUsageTrend: typeof ds.getApiKeyUsageTrend
  getUserUsageTrend: typeof ds.getUserUsageTrend
  getUserSpendingRanking: typeof ds.getUserSpendingRanking
  getBatchUsersUsage: typeof ds.getBatchUsersUsage
  getBatchApiKeysUsage: typeof ds.getBatchApiKeysUsage
}
