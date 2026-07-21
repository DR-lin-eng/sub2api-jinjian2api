/**
 * SubscriptionsRepository (interface). Auto-generated from subscriptionsDatasource.ts.
 */
import type * as ds from '@/features/subscriptions/data/datasources/subscriptionsDatasource'

export type SubscriptionsRepository = {
  readonly getMySubscriptions: typeof ds.getMySubscriptions
  readonly getActiveSubscriptions: typeof ds.getActiveSubscriptions
  readonly getSubscriptionsProgress: typeof ds.getSubscriptionsProgress
  readonly getSubscriptionSummary: typeof ds.getSubscriptionSummary
  readonly getSubscriptionProgress: typeof ds.getSubscriptionProgress
}
