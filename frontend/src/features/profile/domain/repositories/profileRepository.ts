/**
 * ProfileRepository (interface). Auto-generated from profileDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/profileRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/profile/data/datasources/profileDatasource'

export type ProfileRepository = {
  getProfile: typeof ds.getProfile
  updateProfile: typeof ds.updateProfile
  changePassword: typeof ds.changePassword
  sendNotifyEmailCode: typeof ds.sendNotifyEmailCode
  verifyNotifyEmail: typeof ds.verifyNotifyEmail
  removeNotifyEmail: typeof ds.removeNotifyEmail
  toggleNotifyEmail: typeof ds.toggleNotifyEmail
  sendEmailBindingCode: typeof ds.sendEmailBindingCode
  bindEmailIdentity: typeof ds.bindEmailIdentity
  unbindAuthIdentity: typeof ds.unbindAuthIdentity
  resolveWeChatOAuthMode: typeof ds.resolveWeChatOAuthMode
  buildOAuthBindingStartURL: typeof ds.buildOAuthBindingStartURL
  startOAuthBinding: typeof ds.startOAuthBinding
  getAffiliateDetail: typeof ds.getAffiliateDetail
  transferAffiliateQuota: typeof ds.transferAffiliateQuota
  getMyPlatformQuotas: typeof ds.getMyPlatformQuotas
}
