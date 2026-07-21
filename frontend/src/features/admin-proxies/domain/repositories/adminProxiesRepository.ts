/**
 * AdminProxiesRepository (interface). Auto-generated from adminProxiesDatasource.ts.
 */
import type * as ds from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'

export type AdminProxiesRepository = {
  readonly list: typeof ds.list
  readonly getAll: typeof ds.getAll
  readonly getAllWithCount: typeof ds.getAllWithCount
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteProxy: typeof ds.deleteProxy
  readonly toggleStatus: typeof ds.toggleStatus
  readonly testProxy: typeof ds.testProxy
  readonly checkProxyQuality: typeof ds.checkProxyQuality
  readonly getStats: typeof ds.getStats
  readonly getProxyAccounts: typeof ds.getProxyAccounts
  readonly batchCreate: typeof ds.batchCreate
  readonly batchDelete: typeof ds.batchDelete
  readonly exportData: typeof ds.exportData
  readonly importData: typeof ds.importData
}
