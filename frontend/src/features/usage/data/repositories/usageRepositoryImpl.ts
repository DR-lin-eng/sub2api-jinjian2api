/**
 * UsageRepositoryImpl. Auto-generated from usageDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/usage/data/datasources/usageDatasource'
import type { UsageRepository } from '@/features/usage/domain/repositories/usageRepository'

export class UsageRepositoryImpl implements UsageRepository {
  list = ds.list
  query = ds.query
  getStats = ds.getStats
  getStatsByDateRange = ds.getStatsByDateRange
  getByDateRange = ds.getByDateRange
  getById = ds.getById
  getDashboardStats = ds.getDashboardStats
  getDashboardTrend = ds.getDashboardTrend
  getDashboardModels = ds.getDashboardModels
  getMyApiKeyDailyUsage = ds.getMyApiKeyDailyUsage
  getDashboardSnapshotV2 = ds.getDashboardSnapshotV2
  getDashboardApiKeysUsage = ds.getDashboardApiKeysUsage
  listMyErrorRequests = ds.listMyErrorRequests
  getMyErrorDetail = ds.getMyErrorDetail
}

export const usageRepository: UsageRepository = new UsageRepositoryImpl()
