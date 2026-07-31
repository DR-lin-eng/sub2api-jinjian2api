import type { Group } from '@/core/models/domain/group'
import type { User } from '@/core/models/domain/user'

export class UserSubscription {
  id!: number
  userId!: number
  groupId!: number
  status!: 'active' | 'expired' | 'revoked' | 'suspended'
  startsAt!: string
  dailyUsageUsd!: number
  weeklyUsageUsd!: number
  monthlyUsageUsd!: number
  dailyWindowStart!: string
  weeklyWindowStart!: string
  monthlyWindowStart!: string
  createdAt!: string
  updatedAt!: string
  revokedAt!: string
  expiresAt!: string
  user?: User
  group?: Group
}
