import type { AssignSubscriptionRequest } from '@/features/admin-subscriptions/domain/models/subscription'

export interface AssignSubscriptionRequestDto {
  user_id: number
  group_id: number
  validity_days?: number
}

export function toEntity(dto: AssignSubscriptionRequestDto): AssignSubscriptionRequest {
  return {
    userId: dto.user_id,
    groupId: dto.group_id,
    validityDays: dto.validity_days,
  }
}
