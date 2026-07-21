/**
 * SubscriptionsRepositoryImpl. Auto-generated from subscriptionsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/subscriptions/data/datasources/subscriptionsDatasource'
import type { SubscriptionsRepository } from '@/features/subscriptions/domain/repositories/subscriptionsRepository'

export class SubscriptionsRepositoryImpl implements SubscriptionsRepository {
  getMySubscriptions = ds.getMySubscriptions
  getActiveSubscriptions = ds.getActiveSubscriptions
  getSubscriptionsProgress = ds.getSubscriptionsProgress
  getSubscriptionSummary = ds.getSubscriptionSummary
  getSubscriptionProgress = ds.getSubscriptionProgress
}

export const subscriptionsRepository: SubscriptionsRepository = new SubscriptionsRepositoryImpl()
