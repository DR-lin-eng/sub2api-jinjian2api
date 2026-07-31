import type { CurrentUserResponse } from '@/features/auth/domain/models/currentUserResponse'
import type { PublicSettings } from '@/core/models/domain/publicSettings'
import type { LocalCaptchaChallenge } from '@/features/auth/domain/models/localCaptchaChallenge'

export interface AuthQueryRepository {
  getCurrentUser(): Promise<CurrentUserResponse>
  getPublicSettings(): Promise<PublicSettings>
  getLocalCaptcha(): Promise<LocalCaptchaChallenge>
}
