/**
 * AdminUsageRepository (interface). Auto-generated from adminUsageDatasource.ts.
 */
import type * as ds from '@/features/admin-usage/data/datasources/adminUsageDatasource'

export type AdminUsageRepository = {
  readonly list: typeof ds.list
  readonly getStats: typeof ds.getStats
  readonly searchUsers: typeof ds.searchUsers
  readonly searchApiKeys: typeof ds.searchApiKeys
  readonly listCleanupTasks: typeof ds.listCleanupTasks
  readonly createCleanupTask: typeof ds.createCleanupTask
  readonly cancelCleanupTask: typeof ds.cancelCleanupTask
}
