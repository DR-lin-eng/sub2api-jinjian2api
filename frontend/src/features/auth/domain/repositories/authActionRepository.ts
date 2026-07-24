import type { AuthResult } from '@/features/auth/domain/models/authResult'
import type { TotpLoginResult } from '@/features/auth/domain/models/totpLoginResult'
import type { LoginRequest } from '@/features/auth/data/requests_models/loginRequest'
import type { RegisterRequest } from '@/features/auth/data/requests_models/registerRequest'
import type { EncryptedRegisterRequest } from '@/features/auth/data/requests_models/encryptedRegisterRequest'
import type { SendVerifyCodeRequest } from '@/features/auth/data/requests_models/sendVerifyCodeRequest'
import type { ForgotPasswordRequest } from '@/features/auth/data/requests_models/forgotPasswordRequest'
import type { ResetPasswordRequest } from '@/features/auth/data/requests_models/resetPasswordRequest'
import type { TotpLogin2FARequest } from '@/features/auth/data/requests_models/totpLogin2faRequest'
import type { SendVerifyCodeResponse } from '@/types'
import type { SessionRefreshResult } from '@/core/networks/sessionRefresh'

export type LoginResponse = AuthResult | TotpLoginResult

export interface AuthActionRepository {
  login(req: LoginRequest): Promise<LoginResponse>
  login2FA(req: TotpLogin2FARequest): Promise<AuthResult>
  register(req: RegisterRequest | EncryptedRegisterRequest): Promise<AuthResult>
  logout(): Promise<void>
  sendVerifyCode(req: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse>
  sendPendingOAuthVerifyCode(req: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse>
  forgotPassword(req: ForgotPasswordRequest): Promise<{ message: string }>
  resetPassword(req: ResetPasswordRequest): Promise<{ message: string }>
  validatePromoCode(code: string): Promise<{ valid: boolean; bonusAmount?: number; errorCode?: string; message?: string }>
  validateInvitationCode(code: string): Promise<{ valid: boolean; errorCode?: string }>
  refreshToken(): Promise<SessionRefreshResult>
  revokeAllSessions(): Promise<{ message: string }>
  prepareOAuthBindAccessTokenCookie(): Promise<void>
  completePendingOAuthBindLogin(decision?: Record<string, boolean>): Promise<unknown>
  createPendingOAuthAccount(
    provider: 'linuxdo' | 'oidc' | 'wechat' | 'dingtalk',
    invitationCode: string,
    decision?: Record<string, boolean>,
    affiliateCode?: string,
  ): Promise<unknown>
}
