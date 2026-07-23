import type { Group } from '@/features/admin-groups/domain/models/group'
import type { User } from '@/types'

export interface UserSubscription {
  id: number
  userId: number
  groupId: number
  status: 'active' | 'expired' | 'revoked' | 'suspended'
  startsAt: string
  dailyUsageUsd: number
  weeklyUsageUsd: number
  monthlyUsageUsd: number
  dailyWindowStart: string | null
  weeklyWindowStart: string | null
  monthlyWindowStart: string | null
  createdAt: string
  updatedAt: string
  revokedAt?: string | null
  expiresAt: string | null
  user?: User
  group?: Group
}

export interface AssignSubscriptionRequest {
  userId: number
  groupId: number
  validityDays?: number
}

export interface BulkAssignSubscriptionRequest {
  userIds: number[]
  groupId: number
  validityDays?: number
}

export interface ExtendSubscriptionRequest {
  days: number
}

export interface SubscriptionProgress {
  subscriptionId: number
  daily: {
    used: number
    limit: number | null
    percentage: number
    resetInSeconds: number | null
  } | null
  weekly: {
    used: number
    limit: number | null
    percentage: number
    resetInSeconds: number | null
  } | null
  monthly: {
    used: number
    limit: number | null
    percentage: number
    resetInSeconds: number | null
  } | null
  expiresAt: string | null
  daysRemaining: number | null
}
