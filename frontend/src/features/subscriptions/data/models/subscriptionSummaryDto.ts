import type { SubscriptionSummary } from '@/features/subscriptions/domain/models/subscriptionSummary'
import type { SubscriptionSummaryItemDto } from './subscriptionSummaryItemDto'
import { toEntity as toItemEntity } from './subscriptionSummaryItemDto'

export interface SubscriptionSummaryDto {
  active_count: number
  subscriptions: SubscriptionSummaryItemDto[]
}

export function toEntity(dto: SubscriptionSummaryDto): SubscriptionSummary {
  return {
    activeCount: dto.active_count ?? 0,
    subscriptions: (dto.subscriptions ?? []).map(toItemEntity),
  }
}
