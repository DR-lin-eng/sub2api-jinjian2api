import type { User, UserAffiliateDetail, PlatformQuotasResponse } from '@/types'

export interface ProfileQueryRepository {
  getProfile(): Promise<User>
  getAffiliateDetail(): Promise<UserAffiliateDetail>
  getMyPlatformQuotas(): Promise<PlatformQuotasResponse>
}
