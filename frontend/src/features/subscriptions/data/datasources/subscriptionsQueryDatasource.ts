import { apiClient } from '@/core/networks/client'
import { UserSubscriptionDto } from '@/features/admin-subscriptions/data/models/userSubscriptionDto'
import { SubscriptionProgressDto } from '@/features/admin-subscriptions/data/models/subscriptionProgressDto'
import { SubscriptionSummaryDto } from '@/features/subscriptions/data/models/subscriptionSummaryDto'

export class SubscriptionsQueryDatasource {
  async list(): Promise<UserSubscriptionDto[]> {
    const { data } = await apiClient.get<unknown[]>('/subscriptions')
    return (data ?? []).map(item => UserSubscriptionDto.fromJson(item))
  }

  async listActive(): Promise<UserSubscriptionDto[]> {
    const { data } = await apiClient.get<unknown[]>('/subscriptions/active')
    return (data ?? []).map(item => UserSubscriptionDto.fromJson(item))
  }

  async listProgress(): Promise<SubscriptionProgressDto[]> {
    const { data } = await apiClient.get<unknown[]>('/subscriptions/progress')
    return (data ?? []).map(item => SubscriptionProgressDto.fromJson(item))
  }

  async getSummary(): Promise<SubscriptionSummaryDto> {
    const { data } = await apiClient.get<unknown>('/subscriptions/summary')
    return SubscriptionSummaryDto.fromJson(data)
  }

  async getProgress(subscriptionId: number): Promise<SubscriptionProgressDto> {
    const { data } = await apiClient.get<unknown>(`/subscriptions/${subscriptionId}/progress`)
    return SubscriptionProgressDto.fromJson(data)
  }
}

export const subscriptionsQueryDatasource = new SubscriptionsQueryDatasource()
