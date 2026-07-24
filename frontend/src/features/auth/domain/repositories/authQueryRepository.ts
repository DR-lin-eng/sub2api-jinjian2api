import type { CurrentUserResponse, PublicSettings } from '@/types'
import type { LocalCaptchaChallenge } from '@/features/auth/domain/models/localCaptchaChallenge'

export interface AuthQueryRepository {
  getCurrentUser(): Promise<CurrentUserResponse>
  getPublicSettings(): Promise<PublicSettings>
  getLocalCaptcha(): Promise<LocalCaptchaChallenge>
}
