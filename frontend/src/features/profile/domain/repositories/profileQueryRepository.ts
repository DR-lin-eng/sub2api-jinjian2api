import type { User } from '@/core/models/domain/user'
import type { UserAffiliateDetail } from '@/features/affiliate/domain/models/userAffiliateDetail'
import type { PlatformQuotasResponse } from '@/features/profile/domain/models/platformQuotasResponse'
export interface ProfileQueryRepository {
  getProfile(): Promise<User>
  getAffiliateDetail(): Promise<UserAffiliateDetail>
  getMyPlatformQuotas(): Promise<PlatformQuotasResponse>
}
