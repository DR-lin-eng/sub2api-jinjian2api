/**
 * AdminAffiliatesRepositoryImpl. Auto-generated from adminAffiliatesDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/affiliate/data/datasources/adminAffiliatesDatasource'
import type { AdminAffiliatesRepository } from '@/features/affiliate/domain/repositories/adminAffiliatesRepository'

export class AdminAffiliatesRepositoryImpl implements AdminAffiliatesRepository {
  get listUsers(): typeof ds.listUsers { return ds.listUsers }
  get lookupUsers(): typeof ds.lookupUsers { return ds.lookupUsers }
  get updateUserSettings(): typeof ds.updateUserSettings { return ds.updateUserSettings }
  get clearUserSettings(): typeof ds.clearUserSettings { return ds.clearUserSettings }
  get batchSetRate(): typeof ds.batchSetRate { return ds.batchSetRate }
  get listInviteRecords(): typeof ds.listInviteRecords { return ds.listInviteRecords }
  get listRebateRecords(): typeof ds.listRebateRecords { return ds.listRebateRecords }
  get listTransferRecords(): typeof ds.listTransferRecords { return ds.listTransferRecords }
  get getUserOverview(): typeof ds.getUserOverview { return ds.getUserOverview }
}

export const adminAffiliatesRepository: AdminAffiliatesRepository = new AdminAffiliatesRepositoryImpl()
