/**
 * AdminSubscriptionsRepository (interface). Auto-generated from adminSubscriptionsDatasource.ts.
 */
import type * as ds from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsDatasource'

export type AdminSubscriptionsRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly getProgress: typeof ds.getProgress
  readonly assign: typeof ds.assign
  readonly bulkAssign: typeof ds.bulkAssign
  readonly extend: typeof ds.extend
  readonly revoke: typeof ds.revoke
  readonly restore: typeof ds.restore
  readonly resetQuota: typeof ds.resetQuota
  readonly listByGroup: typeof ds.listByGroup
  readonly listByUser: typeof ds.listByUser
}
