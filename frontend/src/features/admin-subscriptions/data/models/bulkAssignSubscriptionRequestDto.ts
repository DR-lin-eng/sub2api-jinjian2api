import type { BulkAssignSubscriptionRequest } from '@/features/admin-subscriptions/domain/models/subscription'

export interface BulkAssignSubscriptionRequestDto {
  user_ids: number[]
  group_id: number
  validity_days?: number
}

export function toEntity(dto: BulkAssignSubscriptionRequestDto): BulkAssignSubscriptionRequest {
  return {
    userIds: dto.user_ids ?? [],
    groupId: dto.group_id,
    validityDays: dto.validity_days,
  }
}
