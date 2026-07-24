import type { User, AffiliateTransferResponse } from '@/types'
import type { UpdateProfileRequest } from '@/features/profile/data/requests_models/updateProfileRequest'
import type { ChangePasswordRequest } from '@/features/profile/data/requests_models/changePasswordRequest'
import type { BindEmailRequest } from '@/features/profile/data/requests_models/bindEmailRequest'
import type { BindableOAuthProvider } from '@/features/profile/data/datasources/profileActionDatasource'

export interface ProfileActionRepository {
  updateProfile(req: UpdateProfileRequest): Promise<User>
  changePassword(req: ChangePasswordRequest): Promise<{ message: string }>
  sendNotifyEmailCode(email: string): Promise<void>
  verifyNotifyEmail(email: string, code: string): Promise<void>
  removeNotifyEmail(email: string): Promise<void>
  toggleNotifyEmail(email: string, disabled: boolean): Promise<User>
  sendEmailBindingCode(email: string): Promise<void>
  bindEmailIdentity(req: BindEmailRequest): Promise<User>
  unbindAuthIdentity(provider: BindableOAuthProvider): Promise<User>
  startOAuthBinding(provider: BindableOAuthProvider, options?: { redirectTo?: string; wechatOAuthSettings?: unknown }): Promise<void>
  transferAffiliateQuota(): Promise<AffiliateTransferResponse>
}
