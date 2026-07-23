import type { ExtendSubscriptionRequest } from '@/features/admin-subscriptions/domain/models/subscription'

export interface ExtendSubscriptionRequestDto {
  days: number
}

export function toEntity(dto: ExtendSubscriptionRequestDto): ExtendSubscriptionRequest {
  return {
    days: dto.days,
  }
}
