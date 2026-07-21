/**
 * AdminRedeemRepositoryImpl. Auto-generated from adminRedeemDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-redeem/data/datasources/adminRedeemDatasource'
import type { AdminRedeemRepository } from '@/features/admin-redeem/domain/repositories/adminRedeemRepository'

export class AdminRedeemRepositoryImpl implements AdminRedeemRepository {
  list = ds.list
  getById = ds.getById
  generate = ds.generate
  deleteCode = ds.deleteCode
  batchDelete = ds.batchDelete
  batchUpdate = ds.batchUpdate
  expire = ds.expire
  getStats = ds.getStats
  exportCodes = ds.exportCodes
}

export const adminRedeemRepository: AdminRedeemRepository = new AdminRedeemRepositoryImpl()
