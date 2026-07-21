/**
 * AdminProxiesRepository (interface). Auto-generated from adminProxiesDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminProxiesRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'

export type AdminProxiesRepository = {
  list: typeof ds.list
  getAll: typeof ds.getAll
  getAllWithCount: typeof ds.getAllWithCount
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteProxy: typeof ds.deleteProxy
  toggleStatus: typeof ds.toggleStatus
  testProxy: typeof ds.testProxy
  checkProxyQuality: typeof ds.checkProxyQuality
  getStats: typeof ds.getStats
  getProxyAccounts: typeof ds.getProxyAccounts
  batchCreate: typeof ds.batchCreate
  batchDelete: typeof ds.batchDelete
  exportData: typeof ds.exportData
  importData: typeof ds.importData
}
