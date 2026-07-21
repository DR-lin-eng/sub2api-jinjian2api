/**
 * AdminProxiesRepositoryImpl. Auto-generated from adminProxiesDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'
import type { AdminProxiesRepository } from '@/features/admin-proxies/domain/repositories/adminProxiesRepository'

export class AdminProxiesRepositoryImpl implements AdminProxiesRepository {
  list = ds.list
  getAll = ds.getAll
  getAllWithCount = ds.getAllWithCount
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteProxy = ds.deleteProxy
  toggleStatus = ds.toggleStatus
  testProxy = ds.testProxy
  checkProxyQuality = ds.checkProxyQuality
  getStats = ds.getStats
  getProxyAccounts = ds.getProxyAccounts
  batchCreate = ds.batchCreate
  batchDelete = ds.batchDelete
  exportData = ds.exportData
  importData = ds.importData
}

export const adminProxiesRepository: AdminProxiesRepository = new AdminProxiesRepositoryImpl()
