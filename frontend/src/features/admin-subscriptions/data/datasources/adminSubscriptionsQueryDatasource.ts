import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/types'
import { UserSubscriptionDto } from '@/features/admin-subscriptions/data/models/userSubscriptionDto'
import { SubscriptionProgressDto } from '@/features/admin-subscriptions/data/models/subscriptionProgressDto'

export class AdminSubscriptionsQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      status?: 'active' | 'expired' | 'revoked' | 'suspended'
      user_id?: number
      group_id?: number
      platform?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<UserSubscriptionDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/subscriptions', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => UserSubscriptionDto.fromJson(item)) }
  }

  async getById(id: number): Promise<UserSubscriptionDto> {
    const { data } = await apiClient.get<unknown>(`/admin/subscriptions/${id}`)
    return UserSubscriptionDto.fromJson(data)
  }

  async getProgress(id: number): Promise<SubscriptionProgressDto> {
    const { data } = await apiClient.get<unknown>(`/admin/subscriptions/${id}/progress`)
    return SubscriptionProgressDto.fromJson(data)
  }

  async listByGroup(
    groupId: number,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedResponse<UserSubscriptionDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(
      `/admin/groups/${groupId}/subscriptions`,
      { params: { page, page_size: pageSize } },
    )
    return { ...data, items: (data.items ?? []).map(item => UserSubscriptionDto.fromJson(item)) }
  }

  async listByUser(
    userId: number,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedResponse<UserSubscriptionDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(
      `/admin/users/${userId}/subscriptions`,
      { params: { page, page_size: pageSize } },
    )
    return { ...data, items: (data.items ?? []).map(item => UserSubscriptionDto.fromJson(item)) }
  }
}

export const adminSubscriptionsQueryDatasource = new AdminSubscriptionsQueryDatasource()
