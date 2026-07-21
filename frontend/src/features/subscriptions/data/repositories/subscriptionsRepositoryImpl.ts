/**
 * SubscriptionsRepositoryImpl. Auto-generated from subscriptionsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/subscriptions/data/datasources/subscriptionsDatasource'
import type { SubscriptionsRepository } from '@/features/subscriptions/domain/repositories/subscriptionsRepository'

export class SubscriptionsRepositoryImpl implements SubscriptionsRepository {
  get getMySubscriptions(): typeof ds.getMySubscriptions { return ds.getMySubscriptions }
  get getActiveSubscriptions(): typeof ds.getActiveSubscriptions { return ds.getActiveSubscriptions }
  get getSubscriptionsProgress(): typeof ds.getSubscriptionsProgress { return ds.getSubscriptionsProgress }
  get getSubscriptionSummary(): typeof ds.getSubscriptionSummary { return ds.getSubscriptionSummary }
  get getSubscriptionProgress(): typeof ds.getSubscriptionProgress { return ds.getSubscriptionProgress }
}

export const subscriptionsRepository: SubscriptionsRepository = new SubscriptionsRepositoryImpl()
