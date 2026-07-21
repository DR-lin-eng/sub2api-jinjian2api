/**
 * AdminUsageRepository (interface). Auto-generated from adminUsageDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminUsageRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-usage/data/datasources/adminUsageDatasource'

export type AdminUsageRepository = {
  list: typeof ds.list
  getStats: typeof ds.getStats
  searchUsers: typeof ds.searchUsers
  searchApiKeys: typeof ds.searchApiKeys
  listCleanupTasks: typeof ds.listCleanupTasks
  createCleanupTask: typeof ds.createCleanupTask
  cancelCleanupTask: typeof ds.cancelCleanupTask
}
