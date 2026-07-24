import type { UserSubscription } from '@/features/admin-subscriptions/domain/models/userSubscription'

export class AdminUser {
  id!: number
  username!: string
  email!: string
  role!: 'admin' | 'user'
  balance!: number
  frozenBalance!: number
  concurrency!: number
  rpmLimit!: number
  status!: 'active' | 'disabled'
  allowedGroups!: number[] | null
  notes!: string
  lastUsedAt!: string
  lastActiveAt!: string
  createdAt!: string
  updatedAt!: string
  deletedAt!: string
  currentConcurrency!: number
  groupRates!: Record<number, number>
  subscriptions?: UserSubscription[]
}
