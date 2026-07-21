/**
 * AdminUsersRepository (interface). Auto-generated from adminUsersDatasource.ts.
 */
import type * as ds from '@/features/admin-users/data/datasources/adminUsersDatasource'

export type AdminUsersRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteUser: typeof ds.deleteUser
  readonly updateBalance: typeof ds.updateBalance
  readonly updateConcurrency: typeof ds.updateConcurrency
  readonly batchUpdateLimits: typeof ds.batchUpdateLimits
  readonly toggleStatus: typeof ds.toggleStatus
  readonly getUserApiKeys: typeof ds.getUserApiKeys
  readonly getUserUsageStats: typeof ds.getUserUsageStats
  readonly getUserBalanceHistory: typeof ds.getUserBalanceHistory
  readonly replaceGroup: typeof ds.replaceGroup
  readonly bindUserAuthIdentity: typeof ds.bindUserAuthIdentity
  readonly getPlatformQuotas: typeof ds.getPlatformQuotas
  readonly getBatchPlatformQuotas: typeof ds.getBatchPlatformQuotas
  readonly updatePlatformQuotas: typeof ds.updatePlatformQuotas
  readonly resetPlatformQuotaWindow: typeof ds.resetPlatformQuotaWindow
}
