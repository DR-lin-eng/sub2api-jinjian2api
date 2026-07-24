import { profileActionDatasource } from '@/features/profile/data/datasources/profileActionDatasource'
import type { ProfileActionRepository } from '@/features/profile/domain/repositories/profileActionRepository'
import type { User } from '@/core/models/domain/user'
import type { AffiliateTransferResponse } from '@/features/affiliate/domain/models/affiliateTransferResponse'
import type { UpdateProfileRequest } from '@/features/profile/data/requests_models/updateProfileRequest'
import type { ChangePasswordRequest } from '@/features/profile/data/requests_models/changePasswordRequest'
import type { BindEmailRequest } from '@/features/profile/data/requests_models/bindEmailRequest'
import type { BindableOAuthProvider } from '@/features/profile/data/datasources/profileActionDatasource'

class ProfileActionRepositoryImpl implements ProfileActionRepository {
  async updateProfile(req: UpdateProfileRequest): Promise<User> {
    return profileActionDatasource.updateProfile(req)
  }

  async changePassword(req: ChangePasswordRequest): Promise<{ message: string }> {
    return profileActionDatasource.changePassword(req)
  }

  async sendNotifyEmailCode(email: string): Promise<void> {
    return profileActionDatasource.sendNotifyEmailCode(email)
  }

  async verifyNotifyEmail(email: string, code: string): Promise<void> {
    return profileActionDatasource.verifyNotifyEmail(email, code)
  }

  async removeNotifyEmail(email: string): Promise<void> {
    return profileActionDatasource.removeNotifyEmail(email)
  }

  async toggleNotifyEmail(email: string, disabled: boolean): Promise<User> {
    return profileActionDatasource.toggleNotifyEmail(email, disabled)
  }

  async sendEmailBindingCode(email: string): Promise<void> {
    return profileActionDatasource.sendEmailBindingCode(email)
  }

  async bindEmailIdentity(req: BindEmailRequest): Promise<User> {
    return profileActionDatasource.bindEmailIdentity(req)
  }

  async unbindAuthIdentity(provider: BindableOAuthProvider): Promise<User> {
    return profileActionDatasource.unbindAuthIdentity(provider)
  }

  async startOAuthBinding(provider: BindableOAuthProvider, options?: { redirectTo?: string; wechatOAuthSettings?: unknown }): Promise<void> {
    return profileActionDatasource.startOAuthBinding(
      provider,
      options as Parameters<typeof profileActionDatasource.startOAuthBinding>[1],
    )
  }

  async transferAffiliateQuota(): Promise<AffiliateTransferResponse> {
    return profileActionDatasource.transferAffiliateQuota()
  }
}

export const profileActionRepository: ProfileActionRepository = new ProfileActionRepositoryImpl()
