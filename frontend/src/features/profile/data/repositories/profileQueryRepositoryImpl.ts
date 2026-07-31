import { profileQueryDatasource } from '@/features/profile/data/datasources/profileQueryDatasource'
import type { ProfileQueryRepository } from '@/features/profile/domain/repositories/profileQueryRepository'
import type { User } from '@/core/models/domain/user'
import type { UserAffiliateDetail } from '@/features/affiliate/domain/models/userAffiliateDetail'
import type { PlatformQuotasResponse } from '@/features/profile/domain/models/platformQuotasResponse'
class ProfileQueryRepositoryImpl implements ProfileQueryRepository {
  getProfile = async () : Promise<User>  => {
    return (await profileQueryDatasource.getProfile()).toEntity()
  }

  getAffiliateDetail = async () : Promise<UserAffiliateDetail>  => {
    return (await profileQueryDatasource.getAffiliateDetail()).toEntity()
  }

  getMyPlatformQuotas = async () : Promise<PlatformQuotasResponse>  => {
    return profileQueryDatasource.getMyPlatformQuotas() as Promise<PlatformQuotasResponse>
  }
}

export const profileQueryRepository: ProfileQueryRepository = new ProfileQueryRepositoryImpl()
