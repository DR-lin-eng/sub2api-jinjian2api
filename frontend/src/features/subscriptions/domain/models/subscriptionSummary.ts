import type { SubscriptionSummaryItem } from './subscriptionSummaryItem'

export interface SubscriptionSummary {
  activeCount: number
  subscriptions: SubscriptionSummaryItem[]
}
