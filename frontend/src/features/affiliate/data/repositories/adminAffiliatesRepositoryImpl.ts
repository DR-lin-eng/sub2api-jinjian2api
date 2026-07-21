/**
 * AdminAffiliatesRepositoryImpl. Auto-generated from adminAffiliatesDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/affiliate/data/datasources/adminAffiliatesDatasource'
import type { AdminAffiliatesRepository } from '@/features/affiliate/domain/repositories/adminAffiliatesRepository'

export class AdminAffiliatesRepositoryImpl implements AdminAffiliatesRepository {
  listUsers = ds.listUsers
  lookupUsers = ds.lookupUsers
  updateUserSettings = ds.updateUserSettings
  clearUserSettings = ds.clearUserSettings
  batchSetRate = ds.batchSetRate
  listInviteRecords = ds.listInviteRecords
  listRebateRecords = ds.listRebateRecords
  listTransferRecords = ds.listTransferRecords
  getUserOverview = ds.getUserOverview
}

export const adminAffiliatesRepository: AdminAffiliatesRepository = new AdminAffiliatesRepositoryImpl()
