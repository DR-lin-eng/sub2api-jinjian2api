/**
 * ProfileRepositoryImpl. Auto-generated from profileDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/profile/data/datasources/profileDatasource'
import type { ProfileRepository } from '@/features/profile/domain/repositories/profileRepository'

export class ProfileRepositoryImpl implements ProfileRepository {
  getProfile = ds.getProfile
  updateProfile = ds.updateProfile
  changePassword = ds.changePassword
  sendNotifyEmailCode = ds.sendNotifyEmailCode
  verifyNotifyEmail = ds.verifyNotifyEmail
  removeNotifyEmail = ds.removeNotifyEmail
  toggleNotifyEmail = ds.toggleNotifyEmail
  sendEmailBindingCode = ds.sendEmailBindingCode
  bindEmailIdentity = ds.bindEmailIdentity
  unbindAuthIdentity = ds.unbindAuthIdentity
  resolveWeChatOAuthMode = ds.resolveWeChatOAuthMode
  buildOAuthBindingStartURL = ds.buildOAuthBindingStartURL
  startOAuthBinding = ds.startOAuthBinding
  getAffiliateDetail = ds.getAffiliateDetail
  transferAffiliateQuota = ds.transferAffiliateQuota
  getMyPlatformQuotas = ds.getMyPlatformQuotas
}

export const profileRepository: ProfileRepository = new ProfileRepositoryImpl()
