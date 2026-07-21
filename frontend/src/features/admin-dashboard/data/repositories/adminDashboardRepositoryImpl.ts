/**
 * AdminDashboardRepositoryImpl. Auto-generated from adminDashboardDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-dashboard/data/datasources/adminDashboardDatasource'
import type { AdminDashboardRepository } from '@/features/admin-dashboard/domain/repositories/adminDashboardRepository'

export class AdminDashboardRepositoryImpl implements AdminDashboardRepository {
  getStats = ds.getStats
  getRealtimeMetrics = ds.getRealtimeMetrics
  getUsageTrend = ds.getUsageTrend
  getModelStats = ds.getModelStats
  getGroupStats = ds.getGroupStats
  getUserBreakdown = ds.getUserBreakdown
  getSnapshotV2 = ds.getSnapshotV2
  getApiKeyUsageTrend = ds.getApiKeyUsageTrend
  getUserUsageTrend = ds.getUserUsageTrend
  getUserSpendingRanking = ds.getUserSpendingRanking
  getBatchUsersUsage = ds.getBatchUsersUsage
  getBatchApiKeysUsage = ds.getBatchApiKeysUsage
}

export const adminDashboardRepository: AdminDashboardRepository = new AdminDashboardRepositoryImpl()
