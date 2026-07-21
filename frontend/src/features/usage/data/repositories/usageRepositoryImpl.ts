/**
 * UsageRepositoryImpl. Auto-generated from usageDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/usage/data/datasources/usageDatasource'
import type { UsageRepository } from '@/features/usage/domain/repositories/usageRepository'

export class UsageRepositoryImpl implements UsageRepository {
  get list(): typeof ds.list { return ds.list }
  get query(): typeof ds.query { return ds.query }
  get getStats(): typeof ds.getStats { return ds.getStats }
  get getStatsByDateRange(): typeof ds.getStatsByDateRange { return ds.getStatsByDateRange }
  get getByDateRange(): typeof ds.getByDateRange { return ds.getByDateRange }
  get getById(): typeof ds.getById { return ds.getById }
  get getDashboardStats(): typeof ds.getDashboardStats { return ds.getDashboardStats }
  get getDashboardTrend(): typeof ds.getDashboardTrend { return ds.getDashboardTrend }
  get getDashboardModels(): typeof ds.getDashboardModels { return ds.getDashboardModels }
  get getMyApiKeyDailyUsage(): typeof ds.getMyApiKeyDailyUsage { return ds.getMyApiKeyDailyUsage }
  get getDashboardSnapshotV2(): typeof ds.getDashboardSnapshotV2 { return ds.getDashboardSnapshotV2 }
  get getDashboardApiKeysUsage(): typeof ds.getDashboardApiKeysUsage { return ds.getDashboardApiKeysUsage }
  get listMyErrorRequests(): typeof ds.listMyErrorRequests { return ds.listMyErrorRequests }
  get getMyErrorDetail(): typeof ds.getMyErrorDetail { return ds.getMyErrorDetail }
}

export const usageRepository: UsageRepository = new UsageRepositoryImpl()
