import type { SubscriptionQuotaWindow } from './subscriptionQuotaWindow'

export class SubscriptionProgress {
  subscriptionId!: number
  daily?: SubscriptionQuotaWindow
  weekly?: SubscriptionQuotaWindow
  monthly?: SubscriptionQuotaWindow
  expiresAt!: string
  daysRemaining!: number | null
}
