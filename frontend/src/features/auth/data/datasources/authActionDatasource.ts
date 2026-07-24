import { apiClient } from '@/core/networks/client'
import { createCredentialEnvelope } from '@/core/networks/credentialEncryption'
import { getAccessToken } from '@/core/networks/tokenStore'
import { refreshBrowserSession } from '@/core/networks/sessionRefresh'
import { AuthResultDto } from '@/features/auth/data/models/authResultDto'
import { TotpLoginResultDto } from '@/features/auth/data/models/totpLoginResultDto'
import type { LoginRequest } from '@/features/auth/data/requests_models/loginRequest'
import type { RegisterRequest } from '@/features/auth/data/requests_models/registerRequest'
import type { EncryptedRegisterRequest } from '@/features/auth/data/requests_models/encryptedRegisterRequest'
import type { SendVerifyCodeRequest } from '@/features/auth/data/requests_models/sendVerifyCodeRequest'
import type { ForgotPasswordRequest } from '@/features/auth/data/requests_models/forgotPasswordRequest'
import type { ResetPasswordRequest } from '@/features/auth/data/requests_models/resetPasswordRequest'
import type { TotpLogin2FARequest } from '@/features/auth/data/requests_models/totpLogin2faRequest'
import type { SendVerifyCodeResponse } from '@/types'

export type LoginDtoResponse = AuthResultDto | TotpLoginResultDto

export function isTotpRequired(dto: LoginDtoResponse): dto is TotpLoginResultDto {
  return dto instanceof TotpLoginResultDto && dto.requires2fa
}

export class AuthActionDatasource {
  async login(req: LoginRequest): Promise<LoginDtoResponse> {
    const { email, password, ...rest } = req
    const credentialEnvelope = await createCredentialEnvelope(email, password)
    const { data } = await apiClient.post<unknown>('/auth/login', {
      ...rest,
      credential_envelope: credentialEnvelope,
    })
    const totpDto = TotpLoginResultDto.fromJson(data)
    if (totpDto.requires2fa) {
      return totpDto
    }
    return AuthResultDto.fromJson(data)
  }

  async login2FA(req: TotpLogin2FARequest): Promise<AuthResultDto> {
    const { data } = await apiClient.post<unknown>('/auth/login/2fa', req)
    return AuthResultDto.fromJson(data)
  }

  async register(req: RegisterRequest | EncryptedRegisterRequest): Promise<AuthResultDto> {
    let payload: EncryptedRegisterRequest
    if ('credential_envelope' in req) {
      payload = req
    } else {
      const { email, password, ...rest } = req as RegisterRequest
      payload = { ...rest, credential_envelope: await createCredentialEnvelope(email, password) }
    }
    const { data } = await apiClient.post<unknown>('/auth/register', payload)
    return AuthResultDto.fromJson(data)
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore
    }
  }

  async sendVerifyCode(req: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse> {
    const { data } = await apiClient.post<SendVerifyCodeResponse>('/auth/send-verify-code', req)
    return data
  }

  async sendPendingOAuthVerifyCode(req: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse> {
    const { data } = await apiClient.post<SendVerifyCodeResponse>('/auth/oauth/pending/send-verify-code', req)
    return data
  }

  async forgotPassword(req: ForgotPasswordRequest): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', req)
    return data
  }

  async resetPassword(req: ResetPasswordRequest): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', req)
    return data
  }

  async validatePromoCode(code: string): Promise<{ valid: boolean; bonusAmount?: number; errorCode?: string; message?: string }> {
    const { data } = await apiClient.post<{ valid: boolean; bonusAmount?: number; errorCode?: string; message?: string }>('/auth/validate-promo-code', { code })
    return data
  }

  async validateInvitationCode(code: string): Promise<{ valid: boolean; errorCode?: string }> {
    const { data } = await apiClient.post<{ valid: boolean; errorCode?: string }>('/auth/validate-invitation-code', { code })
    return data
  }

  refreshToken(): ReturnType<typeof refreshBrowserSession> {
    return refreshBrowserSession()
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/auth/revoke-all-sessions')
    return data
  }

  async prepareOAuthBindAccessTokenCookie(): Promise<void> {
    if (!getAccessToken()) return
    await apiClient.post('/auth/oauth/bind-token')
  }

  async completePendingOAuthBindLogin(decision?: Record<string, boolean>): Promise<unknown> {
    const { data } = await apiClient.post<unknown>('/auth/oauth/pending/exchange', decision ?? {})
    return data
  }

  async createPendingOAuthAccount(
    provider: 'linuxdo' | 'oidc' | 'wechat' | 'dingtalk',
    invitationCode: string,
    decision?: Record<string, boolean>,
    affiliateCode?: string,
  ): Promise<unknown> {
    const normalizedAffiliateCode = affiliateCode?.trim()
    const { data } = await apiClient.post<unknown>(`/auth/oauth/${provider}/complete-registration`, {
      invitation_code: invitationCode,
      ...(normalizedAffiliateCode ? { aff_code: normalizedAffiliateCode } : {}),
      ...(decision ?? {}),
    })
    return data
  }
}

export const authActionDatasource = new AuthActionDatasource()
