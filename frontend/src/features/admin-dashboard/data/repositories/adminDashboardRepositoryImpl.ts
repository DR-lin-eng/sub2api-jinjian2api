/**
 * AdminDashboardRepositoryImpl. Auto-generated from adminDashboardDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-dashboard/data/datasources/adminDashboardDatasource'
import type { AdminDashboardRepository } from '@/features/admin-dashboard/domain/repositories/adminDashboardRepository'

export class AdminDashboardRepositoryImpl implements AdminDashboardRepository {
  get getStats(): typeof ds.getStats { return ds.getStats }
  get getRealtimeMetrics(): typeof ds.getRealtimeMetrics { return ds.getRealtimeMetrics }
  get getUsageTrend(): typeof ds.getUsageTrend { return ds.getUsageTrend }
  get getModelStats(): typeof ds.getModelStats { return ds.getModelStats }
  get getGroupStats(): typeof ds.getGroupStats { return ds.getGroupStats }
  get getUserBreakdown(): typeof ds.getUserBreakdown { return ds.getUserBreakdown }
  get getSnapshotV2(): typeof ds.getSnapshotV2 { return ds.getSnapshotV2 }
  get getApiKeyUsageTrend(): typeof ds.getApiKeyUsageTrend { return ds.getApiKeyUsageTrend }
  get getUserUsageTrend(): typeof ds.getUserUsageTrend { return ds.getUserUsageTrend }
  get getUserSpendingRanking(): typeof ds.getUserSpendingRanking { return ds.getUserSpendingRanking }
  get getBatchUsersUsage(): typeof ds.getBatchUsersUsage { return ds.getBatchUsersUsage }
  get getBatchApiKeysUsage(): typeof ds.getBatchApiKeysUsage { return ds.getBatchApiKeysUsage }
}

export const adminDashboardRepository: AdminDashboardRepository = new AdminDashboardRepositoryImpl()
