import type { UserSubscription } from '@/features/admin-subscriptions/domain/models/subscription'

export interface UserSubscriptionDto {
  id: number
  user_id: number
  group_id: number
  status: 'active' | 'expired' | 'revoked' | 'suspended'
  starts_at: string
  daily_usage_usd: number
  weekly_usage_usd: number
  monthly_usage_usd: number
  daily_window_start: string | null
  weekly_window_start: string | null
  monthly_window_start: string | null
  created_at: string
  updated_at: string
  revoked_at?: string | null
  expires_at: string | null
}

export function toEntity(dto: UserSubscriptionDto): UserSubscription {
  return {
    id: dto.id,
    userId: dto.user_id,
    groupId: dto.group_id,
    status: dto.status,
    startsAt: dto.starts_at,
    dailyUsageUsd: dto.daily_usage_usd ?? 0,
    weeklyUsageUsd: dto.weekly_usage_usd ?? 0,
    monthlyUsageUsd: dto.monthly_usage_usd ?? 0,
    dailyWindowStart: dto.daily_window_start ?? null,
    weeklyWindowStart: dto.weekly_window_start ?? null,
    monthlyWindowStart: dto.monthly_window_start ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    revokedAt: dto.revoked_at ?? null,
    expiresAt: dto.expires_at ?? null,
  }
}
