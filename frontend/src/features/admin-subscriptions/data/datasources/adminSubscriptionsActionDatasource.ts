import { apiClient } from '@/core/networks/client'
import { UserSubscriptionDto } from '@/features/admin-subscriptions/data/models/userSubscriptionDto'
import type { AssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/assignSubscriptionRequest'
import type { BulkAssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/bulkAssignSubscriptionRequest'
import type { ExtendSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/extendSubscriptionRequest'
import type { ResetSubscriptionQuotaRequest } from '@/features/admin-subscriptions/data/requests_models/resetSubscriptionQuotaRequest'

export class AdminSubscriptionsActionDatasource {
  async assign(req: AssignSubscriptionRequest): Promise<UserSubscriptionDto> {
    const { data } = await apiClient.post<unknown>('/admin/subscriptions/assign', req)
    return UserSubscriptionDto.fromJson(data)
  }

  async bulkAssign(req: BulkAssignSubscriptionRequest): Promise<UserSubscriptionDto[]> {
    const { data } = await apiClient.post<unknown[]>('/admin/subscriptions/bulk-assign', req)
    return (data ?? []).map(item => UserSubscriptionDto.fromJson(item))
  }

  async extend(id: number, req: ExtendSubscriptionRequest): Promise<UserSubscriptionDto> {
    const { data } = await apiClient.post<unknown>(`/admin/subscriptions/${id}/extend`, req)
    return UserSubscriptionDto.fromJson(data)
  }

  async revoke(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(`/admin/subscriptions/${id}/revoke`)
    return data
  }

  async restore(id: number): Promise<UserSubscriptionDto> {
    const { data } = await apiClient.post<unknown>(`/admin/subscriptions/${id}/restore`)
    return UserSubscriptionDto.fromJson(data)
  }

  async resetQuota(id: number, req: ResetSubscriptionQuotaRequest): Promise<UserSubscriptionDto> {
    const { data } = await apiClient.post<unknown>(`/admin/subscriptions/${id}/reset-quota`, req)
    return UserSubscriptionDto.fromJson(data)
  }
}

export const adminSubscriptionsActionDatasource = new AdminSubscriptionsActionDatasource()
