/**
 * AdminUsersRepositoryImpl. Auto-generated from adminUsersDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-users/data/datasources/adminUsersDatasource'
import type { AdminUsersRepository } from '@/features/admin-users/domain/repositories/adminUsersRepository'

export class AdminUsersRepositoryImpl implements AdminUsersRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteUser = ds.deleteUser
  updateBalance = ds.updateBalance
  updateConcurrency = ds.updateConcurrency
  batchUpdateLimits = ds.batchUpdateLimits
  toggleStatus = ds.toggleStatus
  getUserApiKeys = ds.getUserApiKeys
  getUserUsageStats = ds.getUserUsageStats
  getUserBalanceHistory = ds.getUserBalanceHistory
  replaceGroup = ds.replaceGroup
  bindUserAuthIdentity = ds.bindUserAuthIdentity
  getPlatformQuotas = ds.getPlatformQuotas
  getBatchPlatformQuotas = ds.getBatchPlatformQuotas
  updatePlatformQuotas = ds.updatePlatformQuotas
  resetPlatformQuotaWindow = ds.resetPlatformQuotaWindow
}

export const adminUsersRepository: AdminUsersRepository = new AdminUsersRepositoryImpl()
