/**
 * AdminProxiesRepositoryImpl. Auto-generated from adminProxiesDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'
import type { AdminProxiesRepository } from '@/features/admin-proxies/domain/repositories/adminProxiesRepository'

export class AdminProxiesRepositoryImpl implements AdminProxiesRepository {
  get list(): typeof ds.list { return ds.list }
  get getAll(): typeof ds.getAll { return ds.getAll }
  get getAllWithCount(): typeof ds.getAllWithCount { return ds.getAllWithCount }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteProxy(): typeof ds.deleteProxy { return ds.deleteProxy }
  get toggleStatus(): typeof ds.toggleStatus { return ds.toggleStatus }
  get testProxy(): typeof ds.testProxy { return ds.testProxy }
  get checkProxyQuality(): typeof ds.checkProxyQuality { return ds.checkProxyQuality }
  get getStats(): typeof ds.getStats { return ds.getStats }
  get getProxyAccounts(): typeof ds.getProxyAccounts { return ds.getProxyAccounts }
  get batchCreate(): typeof ds.batchCreate { return ds.batchCreate }
  get batchDelete(): typeof ds.batchDelete { return ds.batchDelete }
  get exportData(): typeof ds.exportData { return ds.exportData }
  get importData(): typeof ds.importData { return ds.importData }
}

export const adminProxiesRepository: AdminProxiesRepository = new AdminProxiesRepositoryImpl()
