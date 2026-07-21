/**
 * AdminAffiliatesRepository (interface). Auto-generated from adminAffiliatesDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminAffiliatesRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/affiliate/data/datasources/adminAffiliatesDatasource'

export type AdminAffiliatesRepository = {
  listUsers: typeof ds.listUsers
  lookupUsers: typeof ds.lookupUsers
  updateUserSettings: typeof ds.updateUserSettings
  clearUserSettings: typeof ds.clearUserSettings
  batchSetRate: typeof ds.batchSetRate
  listInviteRecords: typeof ds.listInviteRecords
  listRebateRecords: typeof ds.listRebateRecords
  listTransferRecords: typeof ds.listTransferRecords
  getUserOverview: typeof ds.getUserOverview
}
