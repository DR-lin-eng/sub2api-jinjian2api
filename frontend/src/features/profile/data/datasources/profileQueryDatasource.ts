import { apiClient } from '@/core/networks/client'
import type { User } from '@/core/models/domain/user'
import type { UserAffiliateDetail } from '@/features/affiliate/domain/models/userAffiliateDetail'
import type { PlatformQuotasResponse } from '@/features/profile/domain/models/platformQuotasResponse'
export class ProfileQueryDatasource {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/user/profile')
    return data
  }

  async getAffiliateDetail(): Promise<UserAffiliateDetail> {
    const { data } = await apiClient.get<UserAffiliateDetail>('/user/aff')
    return data
  }

  async getMyPlatformQuotas(): Promise<PlatformQuotasResponse> {
    const { data } = await apiClient.get<PlatformQuotasResponse>('/user/platform-quotas')
    return data
  }
}

export const profileQueryDatasource = new ProfileQueryDatasource()
