/**
 * AdminRedeemRepositoryImpl. Auto-generated from adminRedeemDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-redeem/data/datasources/adminRedeemDatasource'
import type { AdminRedeemRepository } from '@/features/admin-redeem/domain/repositories/adminRedeemRepository'

export class AdminRedeemRepositoryImpl implements AdminRedeemRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get generate(): typeof ds.generate { return ds.generate }
  get deleteCode(): typeof ds.deleteCode { return ds.deleteCode }
  get batchDelete(): typeof ds.batchDelete { return ds.batchDelete }
  get batchUpdate(): typeof ds.batchUpdate { return ds.batchUpdate }
  get expire(): typeof ds.expire { return ds.expire }
  get getStats(): typeof ds.getStats { return ds.getStats }
  get exportCodes(): typeof ds.exportCodes { return ds.exportCodes }
}

export const adminRedeemRepository: AdminRedeemRepository = new AdminRedeemRepositoryImpl()
