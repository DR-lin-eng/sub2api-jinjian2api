/**
 * UsageRepository (interface). Auto-generated from usageDatasource.ts.
 */
import type * as ds from '@/features/usage/data/datasources/usageDatasource'

export type UsageRepository = {
  readonly list: typeof ds.list
  readonly query: typeof ds.query
  readonly getStats: typeof ds.getStats
  readonly getStatsByDateRange: typeof ds.getStatsByDateRange
  readonly getByDateRange: typeof ds.getByDateRange
  readonly getById: typeof ds.getById
  readonly getDashboardStats: typeof ds.getDashboardStats
  readonly getDashboardTrend: typeof ds.getDashboardTrend
  readonly getDashboardModels: typeof ds.getDashboardModels
  readonly getMyApiKeyDailyUsage: typeof ds.getMyApiKeyDailyUsage
  readonly getDashboardSnapshotV2: typeof ds.getDashboardSnapshotV2
  readonly getDashboardApiKeysUsage: typeof ds.getDashboardApiKeysUsage
  readonly listMyErrorRequests: typeof ds.listMyErrorRequests
  readonly getMyErrorDetail: typeof ds.getMyErrorDetail
}
