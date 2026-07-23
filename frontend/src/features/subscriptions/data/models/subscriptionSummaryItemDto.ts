import type { SubscriptionSummaryItem } from '@/features/subscriptions/domain/models/subscriptionSummaryItem'

export interface SubscriptionSummaryItemDto {
  id: number
  group_id: number
  group_name?: string
  status: string
  expires_at: string | null
  starts_at: string
}

export function toEntity(dto: SubscriptionSummaryItemDto): SubscriptionSummaryItem {
  return {
    id: dto.id ?? 0,
    groupId: dto.group_id ?? 0,
    groupName: dto.group_name,
    status: dto.status ?? '',
    expiresAt: dto.expires_at ?? null,
    startsAt: dto.starts_at ?? '',
  }
}
