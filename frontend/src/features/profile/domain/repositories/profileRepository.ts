/**
 * ProfileRepository (interface). Auto-generated from profileDatasource.ts.
 */
import type * as ds from '@/features/profile/data/datasources/profileDatasource'

export type ProfileRepository = {
  readonly getProfile: typeof ds.getProfile
  readonly updateProfile: typeof ds.updateProfile
  readonly changePassword: typeof ds.changePassword
  readonly sendNotifyEmailCode: typeof ds.sendNotifyEmailCode
  readonly verifyNotifyEmail: typeof ds.verifyNotifyEmail
  readonly removeNotifyEmail: typeof ds.removeNotifyEmail
  readonly toggleNotifyEmail: typeof ds.toggleNotifyEmail
  readonly sendEmailBindingCode: typeof ds.sendEmailBindingCode
  readonly bindEmailIdentity: typeof ds.bindEmailIdentity
  readonly unbindAuthIdentity: typeof ds.unbindAuthIdentity
  readonly resolveWeChatOAuthMode: typeof ds.resolveWeChatOAuthMode
  readonly buildOAuthBindingStartURL: typeof ds.buildOAuthBindingStartURL
  readonly startOAuthBinding: typeof ds.startOAuthBinding
  readonly getAffiliateDetail: typeof ds.getAffiliateDetail
  readonly transferAffiliateQuota: typeof ds.transferAffiliateQuota
  readonly getMyPlatformQuotas: typeof ds.getMyPlatformQuotas
}
