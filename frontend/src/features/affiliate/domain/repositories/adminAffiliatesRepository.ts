/**
 * AdminAffiliatesRepository (interface). Auto-generated from adminAffiliatesDatasource.ts.
 */
import type * as ds from '@/features/affiliate/data/datasources/adminAffiliatesDatasource'

export type AdminAffiliatesRepository = {
  readonly listUsers: typeof ds.listUsers
  readonly lookupUsers: typeof ds.lookupUsers
  readonly updateUserSettings: typeof ds.updateUserSettings
  readonly clearUserSettings: typeof ds.clearUserSettings
  readonly batchSetRate: typeof ds.batchSetRate
  readonly listInviteRecords: typeof ds.listInviteRecords
  readonly listRebateRecords: typeof ds.listRebateRecords
  readonly listTransferRecords: typeof ds.listTransferRecords
  readonly getUserOverview: typeof ds.getUserOverview
}
