import { authActionDatasource, isTotpRequired } from '@/features/auth/data/datasources/authActionDatasource'
import {
  clearTokenMemory,
  setAccessToken,
  setRefreshTokenMemory,
  setTokenExpiresAtMemory,
} from '@/core/networks/tokenStore'
import type { AuthActionRepository, LoginResponse } from '@/features/auth/domain/repositories/authActionRepository'
import type { LoginRequest } from '@/features/auth/data/requests_models/loginRequest'
import type { RegisterRequest } from '@/features/auth/data/requests_models/registerRequest'
import type { EncryptedRegisterRequest } from '@/features/auth/data/requests_models/encryptedRegisterRequest'
import type { SendVerifyCodeRequest } from '@/features/auth/data/requests_models/sendVerifyCodeRequest'
import type { ForgotPasswordRequest } from '@/features/auth/data/requests_models/forgotPasswordRequest'
import type { ResetPasswordRequest } from '@/features/auth/data/requests_models/resetPasswordRequest'
import type { TotpLogin2FARequest } from '@/features/auth/data/requests_models/totpLogin2faRequest'
import type { AuthResult } from '@/features/auth/domain/models/authResult'
import type { SendVerifyCodeResponse } from '@/types'
import type { AuthResultDto } from '@/features/auth/data/models/authResultDto'

function persistTokens(dto: AuthResultDto): void {
  setAccessToken(dto.accessToken)
  if (dto.refreshToken) setRefreshTokenMemory(dto.refreshToken)
  if (dto.expiresIn) setTokenExpiresAtMemory(Date.now() + dto.expiresIn * 1000)
  localStorage.setItem('auth_user', JSON.stringify(dto.user))
}

class AuthActionRepositoryImpl implements AuthActionRepository {
  private readonly ds = authActionDatasource

  async login(req: LoginRequest): Promise<LoginResponse> {
    const dto = await this.ds.login(req)
    if (isTotpRequired(dto)) {
      return dto.toEntity()
    }
    persistTokens(dto)
    return dto.toEntity()
  }

  async login2FA(req: TotpLogin2FARequest): Promise<AuthResult> {
    const dto = await this.ds.login2FA(req)
    persistTokens(dto)
    return dto.toEntity()
  }

  async register(req: RegisterRequest | EncryptedRegisterRequest): Promise<AuthResult> {
    const dto = await this.ds.register(req)
    persistTokens(dto)
    return dto.toEntity()
  }

  async logout(): Promise<void> {
    await this.ds.logout()
    clearTokenMemory()
    localStorage.removeItem('auth_user')
  }

  sendVerifyCode(req: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse> { return this.ds.sendVerifyCode(req) }
  sendPendingOAuthVerifyCode(req: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse> { return this.ds.sendPendingOAuthVerifyCode(req) }
  forgotPassword(req: ForgotPasswordRequest): Promise<{ message: string }> { return this.ds.forgotPassword(req) }
  resetPassword(req: ResetPasswordRequest): Promise<{ message: string }> { return this.ds.resetPassword(req) }
  validatePromoCode(code: string) { return this.ds.validatePromoCode(code) }
  validateInvitationCode(code: string) { return this.ds.validateInvitationCode(code) }
  refreshToken() { return this.ds.refreshToken() }
  revokeAllSessions(): Promise<{ message: string }> { return this.ds.revokeAllSessions() }
  prepareOAuthBindAccessTokenCookie(): Promise<void> { return this.ds.prepareOAuthBindAccessTokenCookie() }
  completePendingOAuthBindLogin(decision?: Record<string, boolean>): Promise<unknown> { return this.ds.completePendingOAuthBindLogin(decision) }
  createPendingOAuthAccount(
    provider: 'linuxdo' | 'oidc' | 'wechat' | 'dingtalk',
    invitationCode: string,
    decision?: Record<string, boolean>,
    affiliateCode?: string,
  ): Promise<unknown> { return this.ds.createPendingOAuthAccount(provider, invitationCode, decision, affiliateCode) }
}

export const authActionRepository: AuthActionRepository = new AuthActionRepositoryImpl()
