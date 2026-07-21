/**
 * ProfileRepositoryImpl. Auto-generated from profileDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/profile/data/datasources/profileDatasource'
import type { ProfileRepository } from '@/features/profile/domain/repositories/profileRepository'

export class ProfileRepositoryImpl implements ProfileRepository {
  get getProfile(): typeof ds.getProfile { return ds.getProfile }
  get updateProfile(): typeof ds.updateProfile { return ds.updateProfile }
  get changePassword(): typeof ds.changePassword { return ds.changePassword }
  get sendNotifyEmailCode(): typeof ds.sendNotifyEmailCode { return ds.sendNotifyEmailCode }
  get verifyNotifyEmail(): typeof ds.verifyNotifyEmail { return ds.verifyNotifyEmail }
  get removeNotifyEmail(): typeof ds.removeNotifyEmail { return ds.removeNotifyEmail }
  get toggleNotifyEmail(): typeof ds.toggleNotifyEmail { return ds.toggleNotifyEmail }
  get sendEmailBindingCode(): typeof ds.sendEmailBindingCode { return ds.sendEmailBindingCode }
  get bindEmailIdentity(): typeof ds.bindEmailIdentity { return ds.bindEmailIdentity }
  get unbindAuthIdentity(): typeof ds.unbindAuthIdentity { return ds.unbindAuthIdentity }
  get resolveWeChatOAuthMode(): typeof ds.resolveWeChatOAuthMode { return ds.resolveWeChatOAuthMode }
  get buildOAuthBindingStartURL(): typeof ds.buildOAuthBindingStartURL { return ds.buildOAuthBindingStartURL }
  get startOAuthBinding(): typeof ds.startOAuthBinding { return ds.startOAuthBinding }
  get getAffiliateDetail(): typeof ds.getAffiliateDetail { return ds.getAffiliateDetail }
  get transferAffiliateQuota(): typeof ds.transferAffiliateQuota { return ds.transferAffiliateQuota }
  get getMyPlatformQuotas(): typeof ds.getMyPlatformQuotas { return ds.getMyPlatformQuotas }
}

export const profileRepository: ProfileRepository = new ProfileRepositoryImpl()
