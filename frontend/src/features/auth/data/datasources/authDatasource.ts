/**
 * Local administrator authentication endpoints.
 */

import { apiClient } from '@/core/networks/client'
import { createCredentialEnvelope } from '@/core/networks/credentialEncryption'
import {
  clearTokenMemory,
  setAccessToken,
  setRefreshTokenMemory,
  setTokenExpiresAtMemory
} from '@/core/networks/tokenStore'
import { refreshBrowserSession, type SessionRefreshResult } from '@/core/networks/sessionRefresh'
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginRequest,
  PublicSettings,
  TotpLogin2FARequest,
  TotpLoginResponse
} from '@/types'

export type LoginResponse = AuthResponse | TotpLoginResponse
export type RefreshTokenResponse = SessionRefreshResult

export function isTotp2FARequired(response: LoginResponse): response is TotpLoginResponse {
  return 'requires_2fa' in response && response.requires_2fa === true
}

function rememberAuthResponse(response: AuthResponse): void {
  setAccessToken(response.access_token)
  if (response.refresh_token) {
    setRefreshTokenMemory(response.refresh_token)
  }
  if (response.expires_in) {
    setTokenExpiresAtMemory(Date.now() + response.expires_in * 1000)
  }
  localStorage.setItem('auth_user', JSON.stringify(response.user))
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { email, password, ...requestData } = credentials
  const credentialEnvelope = await createCredentialEnvelope(email, password)
  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    ...requestData,
    credential_envelope: credentialEnvelope
  })

  if (!isTotp2FARequired(data)) {
    rememberAuthResponse(data)
  }
  return data
}

export async function login2FA(request: TotpLogin2FARequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login/2fa', request)
  rememberAuthResponse(data)
  return data
}

export async function getCurrentUser() {
  return apiClient.get<CurrentUserResponse>('/auth/me')
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    clearTokenMemory()
    localStorage.removeItem('auth_user')
  }
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  return refreshBrowserSession()
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const { data } = await apiClient.get<PublicSettings>('/settings/public')
  return data
}

export const authAPI = {
  login,
  login2FA,
  getCurrentUser,
  logout,
  refreshToken,
  getPublicSettings
}

export default authAPI
