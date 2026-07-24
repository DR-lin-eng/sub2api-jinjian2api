import { profileQueryDatasource } from '@/features/profile/data/datasources/profileQueryDatasource'
import type { ProfileQueryRepository } from '@/features/profile/domain/repositories/profileQueryRepository'
import type { User } from '@/core/models/domain/user'
import type { UserAffiliateDetail } from '@/features/affiliate/domain/models/userAffiliateDetail'
import type { PlatformQuotasResponse } from '@/features/profile/domain/models/platformQuotasResponse'
class ProfileQueryRepositoryImpl implements ProfileQueryRepository {
  async getProfile(): Promise<User> {
    return profileQueryDatasource.getProfile()
  }

  async getAffiliateDetail(): Promise<UserAffiliateDetail> {
    return profileQueryDatasource.getAffiliateDetail()
  }

  async getMyPlatformQuotas(): Promise<PlatformQuotasResponse> {
    return profileQueryDatasource.getMyPlatformQuotas()
  }
}

export const profileQueryRepository: ProfileQueryRepository = new ProfileQueryRepositoryImpl()
