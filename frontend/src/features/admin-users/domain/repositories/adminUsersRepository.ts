/**
 * AdminUsersRepository (interface). Auto-generated from adminUsersDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminUsersRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-users/data/datasources/adminUsersDatasource'

export type AdminUsersRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteUser: typeof ds.deleteUser
  updateBalance: typeof ds.updateBalance
  updateConcurrency: typeof ds.updateConcurrency
  batchUpdateLimits: typeof ds.batchUpdateLimits
  toggleStatus: typeof ds.toggleStatus
  getUserApiKeys: typeof ds.getUserApiKeys
  getUserUsageStats: typeof ds.getUserUsageStats
  getUserBalanceHistory: typeof ds.getUserBalanceHistory
  replaceGroup: typeof ds.replaceGroup
  bindUserAuthIdentity: typeof ds.bindUserAuthIdentity
  getPlatformQuotas: typeof ds.getPlatformQuotas
  getBatchPlatformQuotas: typeof ds.getBatchPlatformQuotas
  updatePlatformQuotas: typeof ds.updatePlatformQuotas
  resetPlatformQuotaWindow: typeof ds.resetPlatformQuotaWindow
}
