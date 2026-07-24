import type { UserSubscription } from '@/features/admin-subscriptions/domain/models/userSubscription'
import type { SubscriptionProgress } from '@/features/admin-subscriptions/domain/models/subscriptionProgress'
import type { SubscriptionSummary } from '@/features/subscriptions/domain/models/subscriptionSummary'

export interface SubscriptionsQueryRepository {
  list(): Promise<UserSubscription[]>
  listActive(): Promise<UserSubscription[]>
  listProgress(): Promise<SubscriptionProgress[]>
  getSummary(): Promise<SubscriptionSummary>
  getProgress(subscriptionId: number): Promise<SubscriptionProgress>
}
