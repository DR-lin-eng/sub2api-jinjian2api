/**
 * SubscriptionsRepository (interface). Auto-generated from subscriptionsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/subscriptionsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/subscriptions/data/datasources/subscriptionsDatasource'

export type SubscriptionsRepository = {
  getMySubscriptions: typeof ds.getMySubscriptions
  getActiveSubscriptions: typeof ds.getActiveSubscriptions
  getSubscriptionsProgress: typeof ds.getSubscriptionsProgress
  getSubscriptionSummary: typeof ds.getSubscriptionSummary
  getSubscriptionProgress: typeof ds.getSubscriptionProgress
}
