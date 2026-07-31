import { apiClient } from '@/core/networks/client'
import { GrokAuthUrlResponseDto } from '@/features/admin-accounts/data/models/grokAuthUrlResponseDto'
import { GrokTokenInfoDto } from '@/features/admin-accounts/data/models/grokTokenInfoDto'
import { GrokSSOToOAuthResponseDto } from '@/features/admin-accounts/data/models/grokSSOToOAuthResponseDto'
import { GrokQuotaResetResultDto } from '@/features/admin-accounts/data/models/grokQuotaResetResultDto'
import type { GrokAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/grokAuthUrlRequest'
import type { GrokExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/grokExchangeCodeRequest'
import type { GrokSSOToOAuthRequest } from '@/features/admin-accounts/data/requests_models/grokSSOToOAuthRequest'

const GROK_SSO_IMPORT_CONCURRENCY = 3
const GROK_SSO_IMPORT_TIMEOUT_PER_BATCH_MS = 90_000
const GROK_SSO_IMPORT_TIMEOUT_BUFFER_MS = 90_000

function ssoImportTimeout(keyCount: number): number {
  const batches = Math.ceil(Math.max(1, keyCount) / GROK_SSO_IMPORT_CONCURRENCY)
  return batches * GROK_SSO_IMPORT_TIMEOUT_PER_BATCH_MS + GROK_SSO_IMPORT_TIMEOUT_BUFFER_MS
}

export class GrokActionDatasource {
  async generateAuthUrl(payload: GrokAuthUrlRequest): Promise<GrokAuthUrlResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/grok/oauth/auth-url', payload)
    return GrokAuthUrlResponseDto.fromJson(data)
  }

  async exchangeCode(payload: GrokExchangeCodeRequest): Promise<GrokTokenInfoDto> {
    const { data } = await apiClient.post<unknown>('/admin/grok/oauth/exchange-code', payload)
    return GrokTokenInfoDto.fromJson(data)
  }

  async refreshGrokToken(refreshToken: string, proxyId?: number | null): Promise<GrokTokenInfoDto> {
    const payload: Record<string, unknown> = { refresh_token: refreshToken }
    if (proxyId) payload.proxy_id = proxyId
    const { data } = await apiClient.post<unknown>('/admin/grok/oauth/refresh-token', payload)
    return GrokTokenInfoDto.fromJson(data)
  }

  async resetQuota(id: number): Promise<GrokQuotaResetResultDto> {
    const { data } = await apiClient.post<unknown>(`/admin/grok/accounts/${id}/reset-quota`)
    return GrokQuotaResetResultDto.fromJson(data)
  }

  async createFromSSO(payload: GrokSSOToOAuthRequest): Promise<GrokSSOToOAuthResponseDto> {
    const { data } = await apiClient.post<unknown>(
      '/admin/grok/sso-to-oauth',
      payload,
      { timeout: ssoImportTimeout((payload.sso_tokens ?? []).length) },
    )
    return GrokSSOToOAuthResponseDto.fromJson(data)
  }
}

export const grokActionDatasource = new GrokActionDatasource()
