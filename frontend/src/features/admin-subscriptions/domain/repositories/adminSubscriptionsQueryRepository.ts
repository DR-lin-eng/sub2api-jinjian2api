import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { SubscriptionProgress } from '@/features/admin-subscriptions/domain/models/subscriptionProgress'

export interface AdminSubscriptionsQueryRepository {
  list(
    page: number,
    pageSize: number,
    filters?: {
      status?: 'active' | 'expired' | 'revoked' | 'suspended'
      user_id?: number
      group_id?: number
      platform?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<UserSubscription>>
  getById(id: number): Promise<UserSubscription>
  getProgress(id: number): Promise<SubscriptionProgress>
  listByGroup(groupId: number, page: number, pageSize: number): Promise<PaginatedResponse<UserSubscription>>
  listByUser(userId: number, page: number, pageSize: number): Promise<PaginatedResponse<UserSubscription>>
}
