export interface SubscriptionSummaryItem {
  id: number
  groupId: number
  groupName?: string
  status: string
  expiresAt: string | null
  startsAt: string
}
