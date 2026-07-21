/**
 * AdminDashboardRepository (interface). Auto-generated from adminDashboardDatasource.ts.
 */
import type * as ds from '@/features/admin-dashboard/data/datasources/adminDashboardDatasource'

export type AdminDashboardRepository = {
  readonly getStats: typeof ds.getStats
  readonly getRealtimeMetrics: typeof ds.getRealtimeMetrics
  readonly getUsageTrend: typeof ds.getUsageTrend
  readonly getModelStats: typeof ds.getModelStats
  readonly getGroupStats: typeof ds.getGroupStats
  readonly getUserBreakdown: typeof ds.getUserBreakdown
  readonly getSnapshotV2: typeof ds.getSnapshotV2
  readonly getApiKeyUsageTrend: typeof ds.getApiKeyUsageTrend
  readonly getUserUsageTrend: typeof ds.getUserUsageTrend
  readonly getUserSpendingRanking: typeof ds.getUserSpendingRanking
  readonly getBatchUsersUsage: typeof ds.getBatchUsersUsage
  readonly getBatchApiKeysUsage: typeof ds.getBatchApiKeysUsage
}
