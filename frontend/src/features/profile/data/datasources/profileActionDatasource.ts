import { apiClient } from '@/core/networks/client'
import type { User } from '@/core/models/domain/user'
import type { AffiliateTransferResponse } from '@/features/affiliate/domain/models/affiliateTransferResponse'
import type { UpdateProfileRequest } from '@/features/profile/data/requests_models/updateProfileRequest'
import type { ChangePasswordRequest } from '@/features/profile/data/requests_models/changePasswordRequest'
import type { BindEmailRequest } from '@/features/profile/data/requests_models/bindEmailRequest'
import type { UserAuthProvider } from '@/core/models/domain/userAuthProvider'
import {
  resolveWeChatOAuthStartStrict,
  type WeChatOAuthPublicSettings,
} from '@/features/auth/presentation/utils/wechatOAuthResolver'
import { authActionDatasource } from '@/features/auth/data/datasources/authActionDatasource'

const prepareOAuthBindAccessTokenCookie = authActionDatasource.prepareOAuthBindAccessTokenCookie.bind(authActionDatasource)

export type BindableOAuthProvider = Exclude<UserAuthProvider, 'email'>

interface BuildOAuthBindingStartURLOptions {
  redirectTo?: string
  wechatOAuthSettings?: WeChatOAuthPublicSettings | null
}

export function resolveWeChatOAuthMode(): 'open' | 'mp' {
  if (typeof navigator === 'undefined') return 'open'
  return /MicroMessenger/i.test(navigator.userAgent) ? 'mp' : 'open'
}

function resolveWeChatOAuthBindingMode(settings?: WeChatOAuthPublicSettings | null): 'open' | 'mp' | null {
  if (settings) return resolveWeChatOAuthStartStrict(settings).mode
  return resolveWeChatOAuthMode()
}

export function buildOAuthBindingStartURL(
  provider: BindableOAuthProvider,
  options: BuildOAuthBindingStartURLOptions = {},
): string | null {
  const redirectTo = options.redirectTo?.trim() || '/profile'
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api/v1'
  const normalized = apiBase.replace(/\/$/, '')
  const params = new URLSearchParams({ redirect: redirectTo, intent: 'bind_current_user' })
  if (provider === 'wechat') {
    const mode = resolveWeChatOAuthBindingMode(options.wechatOAuthSettings)
    if (!mode) return null
    params.set('mode', mode)
  }
  return `${normalized}/auth/oauth/${provider}/bind/start?${params.toString()}`
}

export class ProfileActionDatasource {
  async updateProfile(req: UpdateProfileRequest): Promise<User> {
    const { data } = await apiClient.put<User>('/user', req)
    return data
  }

  async changePassword(req: ChangePasswordRequest): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>('/user/password', req)
    return data
  }

  async sendNotifyEmailCode(email: string): Promise<void> {
    await apiClient.post('/user/notify-email/send-code', { email })
  }

  async verifyNotifyEmail(email: string, code: string): Promise<void> {
    await apiClient.post('/user/notify-email/verify', { email, code })
  }

  async removeNotifyEmail(email: string): Promise<void> {
    await apiClient.delete('/user/notify-email', { data: { email } })
  }

  async toggleNotifyEmail(email: string, disabled: boolean): Promise<User> {
    const { data } = await apiClient.put<User>('/user/notify-email/toggle', { email, disabled })
    return data
  }

  async sendEmailBindingCode(email: string): Promise<void> {
    await apiClient.post('/user/account-bindings/email/send-code', { email })
  }

  async bindEmailIdentity(req: BindEmailRequest): Promise<User> {
    const { data } = await apiClient.post<User>('/user/account-bindings/email', req)
    return data
  }

  async unbindAuthIdentity(provider: BindableOAuthProvider): Promise<User> {
    const { data } = await apiClient.delete<User>(`/user/account-bindings/${provider}`)
    return data
  }

  async startOAuthBinding(
    provider: BindableOAuthProvider,
    options: BuildOAuthBindingStartURLOptions = {},
  ): Promise<void> {
    if (typeof window === 'undefined') return
    const startURL = buildOAuthBindingStartURL(provider, options)
    if (!startURL) return
    await prepareOAuthBindAccessTokenCookie()
    window.location.href = startURL
  }

  async transferAffiliateQuota(): Promise<AffiliateTransferResponse> {
    const { data } = await apiClient.post<AffiliateTransferResponse>('/user/aff/transfer')
    return data
  }
}

export const profileActionDatasource = new ProfileActionDatasource()
