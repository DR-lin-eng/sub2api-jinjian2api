import type { SubscriptionSummaryItem } from './subscriptionSummaryItem'

export class SubscriptionSummary {
  activeCount!: number
  subscriptions!: SubscriptionSummaryItem[]
}
