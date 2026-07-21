/**
 * AdminSubscriptionsRepositoryImpl. Auto-generated from adminSubscriptionsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsDatasource'
import type { AdminSubscriptionsRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsRepository'

export class AdminSubscriptionsRepositoryImpl implements AdminSubscriptionsRepository {
  list = ds.list
  getById = ds.getById
  getProgress = ds.getProgress
  assign = ds.assign
  bulkAssign = ds.bulkAssign
  extend = ds.extend
  revoke = ds.revoke
  restore = ds.restore
  resetQuota = ds.resetQuota
  listByGroup = ds.listByGroup
  listByUser = ds.listByUser
}

export const adminSubscriptionsRepository: AdminSubscriptionsRepository = new AdminSubscriptionsRepositoryImpl()
