import { profileActionDatasource } from '@/features/profile/data/datasources/profileActionDatasource'
import type { ProfileActionRepository } from '@/features/profile/domain/repositories/profileActionRepository'
import type { User } from '@/core/models/domain/user'
import type { AffiliateTransferResponse } from '@/features/affiliate/domain/models/affiliateTransferResponse'
import type { UpdateProfileRequest } from '@/features/profile/data/requests_models/updateProfileRequest'
import type { ChangePasswordRequest } from '@/features/profile/data/requests_models/changePasswordRequest'
import type { BindEmailRequest } from '@/features/profile/data/requests_models/bindEmailRequest'
import type { BindableOAuthProvider } from '@/features/profile/data/datasources/profileActionDatasource'

class ProfileActionRepositoryImpl implements ProfileActionRepository {
  updateProfile = async (req: UpdateProfileRequest) : Promise<User>  => {
    return (await profileActionDatasource.updateProfile(req)).toEntity()
  }

  changePassword = async (req: ChangePasswordRequest) : Promise<{ message: string }>  => {
    return profileActionDatasource.changePassword(req)
  }

  sendNotifyEmailCode = async (email: string) : Promise<void>  => {
    return profileActionDatasource.sendNotifyEmailCode(email)
  }

  verifyNotifyEmail = async (email: string, code: string) : Promise<void>  => {
    return profileActionDatasource.verifyNotifyEmail(email, code)
  }

  removeNotifyEmail = async (email: string) : Promise<void>  => {
    return profileActionDatasource.removeNotifyEmail(email)
  }

  toggleNotifyEmail = async (email: string, disabled: boolean) : Promise<User>  => {
    return (await profileActionDatasource.toggleNotifyEmail(email, disabled)).toEntity()
  }

  sendEmailBindingCode = async (email: string) : Promise<void>  => {
    return profileActionDatasource.sendEmailBindingCode(email)
  }

  bindEmailIdentity = async (req: BindEmailRequest) : Promise<User>  => {
    return (await profileActionDatasource.bindEmailIdentity(req)).toEntity()
  }

  unbindAuthIdentity = async (provider: BindableOAuthProvider) : Promise<User>  => {
    return (await profileActionDatasource.unbindAuthIdentity(provider)).toEntity()
  }

  startOAuthBinding = async (provider: BindableOAuthProvider, options?: { redirectTo?: string; wechatOAuthSettings?: unknown }) : Promise<void>  => {
    return profileActionDatasource.startOAuthBinding(
      provider,
      options as Parameters<typeof profileActionDatasource.startOAuthBinding>[1],
    )
  }

  transferAffiliateQuota = async () : Promise<AffiliateTransferResponse>  => {
    return (await profileActionDatasource.transferAffiliateQuota()).toEntity()
  }
}

export const profileActionRepository: ProfileActionRepository = new ProfileActionRepositoryImpl()
