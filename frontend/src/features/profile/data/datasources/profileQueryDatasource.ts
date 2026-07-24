import { apiClient } from '@/core/networks/client'
import { UserDto } from '@/core/models/data/userDto'
import { UserAffiliateDetailDto } from '@/features/affiliate/data/models/userAffiliateDetailDto'

export class ProfileQueryDatasource {
  async getProfile(): Promise<UserDto> {
    const { data } = await apiClient.get<unknown>('/user/profile')
    return UserDto.fromJson(data)
  }

  async getAffiliateDetail(): Promise<UserAffiliateDetailDto> {
    const { data } = await apiClient.get<unknown>('/user/aff')
    return UserAffiliateDetailDto.fromJson(data)
  }

  async getMyPlatformQuotas(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/user/platform-quotas')
    return data
  }
}

export const profileQueryDatasource = new ProfileQueryDatasource()
