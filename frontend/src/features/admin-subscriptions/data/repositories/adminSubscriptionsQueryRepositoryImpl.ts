import { adminSubscriptionsQueryDatasource } from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsQueryDatasource'
import type { AdminSubscriptionsQueryRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsQueryRepository'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { SubscriptionProgress } from '@/features/admin-subscriptions/domain/models/subscriptionProgress'

class AdminSubscriptionsQueryRepositoryImpl implements AdminSubscriptionsQueryRepository {
  private readonly ds = adminSubscriptionsQueryDatasource

  list = async (
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
  ): Promise<PaginatedResponse<UserSubscription>> => {
    const result = await this.ds.list(page, pageSize, filters, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getById = async (id: number) : Promise<UserSubscription>  => {
    return (await this.ds.getById(id)).toEntity()
  }

  getProgress = async (id: number) : Promise<SubscriptionProgress>  => {
    return (await this.ds.getProgress(id)).toEntity()
  }

  listByGroup = async (groupId: number, page: number, pageSize: number) : Promise<PaginatedResponse<UserSubscription>>  => {
    const result = await this.ds.listByGroup(groupId, page, pageSize)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  listByUser = async (userId: number, page: number, pageSize: number) : Promise<PaginatedResponse<UserSubscription>>  => {
    const result = await this.ds.listByUser(userId, page, pageSize)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }
}

export const adminSubscriptionsQueryRepository: AdminSubscriptionsQueryRepository =
  new AdminSubscriptionsQueryRepositoryImpl()
