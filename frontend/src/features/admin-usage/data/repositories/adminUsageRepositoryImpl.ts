/**
 * AdminUsageRepositoryImpl. Auto-generated from adminUsageDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-usage/data/datasources/adminUsageDatasource'
import type { AdminUsageRepository } from '@/features/admin-usage/domain/repositories/adminUsageRepository'

export class AdminUsageRepositoryImpl implements AdminUsageRepository {
  list = ds.list
  getStats = ds.getStats
  searchUsers = ds.searchUsers
  searchApiKeys = ds.searchApiKeys
  listCleanupTasks = ds.listCleanupTasks
  createCleanupTask = ds.createCleanupTask
  cancelCleanupTask = ds.cancelCleanupTask
}

export const adminUsageRepository: AdminUsageRepository = new AdminUsageRepositoryImpl()
