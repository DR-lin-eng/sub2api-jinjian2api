/**
 * AdminSubscriptionsRepositoryImpl. Auto-generated from adminSubscriptionsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsDatasource'
import type { AdminSubscriptionsRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsRepository'

export class AdminSubscriptionsRepositoryImpl implements AdminSubscriptionsRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get getProgress(): typeof ds.getProgress { return ds.getProgress }
  get assign(): typeof ds.assign { return ds.assign }
  get bulkAssign(): typeof ds.bulkAssign { return ds.bulkAssign }
  get extend(): typeof ds.extend { return ds.extend }
  get revoke(): typeof ds.revoke { return ds.revoke }
  get restore(): typeof ds.restore { return ds.restore }
  get resetQuota(): typeof ds.resetQuota { return ds.resetQuota }
  get listByGroup(): typeof ds.listByGroup { return ds.listByGroup }
  get listByUser(): typeof ds.listByUser { return ds.listByUser }
}

export const adminSubscriptionsRepository: AdminSubscriptionsRepository = new AdminSubscriptionsRepositoryImpl()
