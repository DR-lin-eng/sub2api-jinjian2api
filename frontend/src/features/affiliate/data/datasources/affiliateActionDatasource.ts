import { apiClient } from '@/core/networks/client'
import { SimpleUserDto } from '@/features/affiliate/data/models/simpleUserDto'
import type { UpdateAffiliateUserRequest } from '@/features/affiliate/data/requests_models/updateAffiliateUserRequest'
import type { BatchSetRateRequest } from '@/features/affiliate/data/requests_models/batchSetRateRequest'

export class AffiliateActionDatasource {
  async lookupUsers(q: string): Promise<SimpleUserDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/affiliates/users/lookup', { params: { q } })
    return (data ?? []).map(item => SimpleUserDto.fromJson(item))
  }

  async updateUserSettings(userId: number, req: UpdateAffiliateUserRequest): Promise<{ userId: number }> {
    const { data } = await apiClient.put<{ user_id: number }>(`/admin/affiliates/users/${userId}`, req)
    return { userId: data.user_id }
  }

  async clearUserSettings(userId: number): Promise<{ userId: number }> {
    const { data } = await apiClient.delete<{ user_id: number }>(`/admin/affiliates/users/${userId}`)
    return { userId: data.user_id }
  }

  async batchSetRate(req: BatchSetRateRequest): Promise<{ affected: number }> {
    const { data } = await apiClient.post<{ affected: number }>('/admin/affiliates/users/batch-rate', req)
    return data
  }
}

export const affiliateActionDatasource = new AffiliateActionDatasource()
