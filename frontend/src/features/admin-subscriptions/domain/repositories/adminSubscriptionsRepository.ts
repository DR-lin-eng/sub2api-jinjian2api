/**
 * AdminSubscriptionsRepository (interface). Auto-generated from adminSubscriptionsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminSubscriptionsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsDatasource'

export type AdminSubscriptionsRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  getProgress: typeof ds.getProgress
  assign: typeof ds.assign
  bulkAssign: typeof ds.bulkAssign
  extend: typeof ds.extend
  revoke: typeof ds.revoke
  restore: typeof ds.restore
  resetQuota: typeof ds.resetQuota
  listByGroup: typeof ds.listByGroup
  listByUser: typeof ds.listByUser
}
