/**
 * AdminUsageRepositoryImpl. Auto-generated from adminUsageDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-usage/data/datasources/adminUsageDatasource'
import type { AdminUsageRepository } from '@/features/admin-usage/domain/repositories/adminUsageRepository'

export class AdminUsageRepositoryImpl implements AdminUsageRepository {
  get list(): typeof ds.list { return ds.list }
  get getStats(): typeof ds.getStats { return ds.getStats }
  get searchUsers(): typeof ds.searchUsers { return ds.searchUsers }
  get searchApiKeys(): typeof ds.searchApiKeys { return ds.searchApiKeys }
  get listCleanupTasks(): typeof ds.listCleanupTasks { return ds.listCleanupTasks }
  get createCleanupTask(): typeof ds.createCleanupTask { return ds.createCleanupTask }
  get cancelCleanupTask(): typeof ds.cancelCleanupTask { return ds.cancelCleanupTask }
}

export const adminUsageRepository: AdminUsageRepository = new AdminUsageRepositoryImpl()
