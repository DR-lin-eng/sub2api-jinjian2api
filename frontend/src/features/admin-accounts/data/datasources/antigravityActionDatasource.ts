import { apiClient } from '@/core/networks/client'
import { AntigravityAuthUrlResponseDto } from '@/features/admin-accounts/data/models/antigravityAuthUrlResponseDto'
import { AntigravityTokenInfoDto } from '@/features/admin-accounts/data/models/antigravityTokenInfoDto'
import type { AntigravityAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/antigravityAuthUrlRequest'
import type { AntigravityExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/antigravityExchangeCodeRequest'

export class AntigravityActionDatasource {
  async generateAuthUrl(payload: AntigravityAuthUrlRequest): Promise<AntigravityAuthUrlResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/antigravity/oauth/auth-url', payload)
    return AntigravityAuthUrlResponseDto.fromJson(data)
  }

  async exchangeCode(payload: AntigravityExchangeCodeRequest): Promise<AntigravityTokenInfoDto> {
    const { data } = await apiClient.post<unknown>('/admin/antigravity/oauth/exchange-code', payload)
    return AntigravityTokenInfoDto.fromJson(data)
  }

  async refreshAntigravityToken(refreshToken: string, proxyId?: number | null): Promise<AntigravityTokenInfoDto> {
    const payload: Record<string, unknown> = { refresh_token: refreshToken }
    if (proxyId) payload.proxy_id = proxyId
    const { data } = await apiClient.post<unknown>('/admin/antigravity/oauth/refresh-token', payload)
    return AntigravityTokenInfoDto.fromJson(data)
  }
}

export const antigravityActionDatasource = new AntigravityActionDatasource()
