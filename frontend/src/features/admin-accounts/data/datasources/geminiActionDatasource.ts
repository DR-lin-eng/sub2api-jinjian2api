import { apiClient } from '@/core/networks/client'
import { GeminiAuthUrlResponseDto } from '@/features/admin-accounts/data/models/geminiAuthUrlResponseDto'
import { GeminiTokenInfoDto } from '@/features/admin-accounts/data/models/geminiTokenInfoDto'
import type { GeminiAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/geminiAuthUrlRequest'
import type { GeminiExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/geminiExchangeCodeRequest'

export class GeminiActionDatasource {
  async generateAuthUrl(payload: GeminiAuthUrlRequest): Promise<GeminiAuthUrlResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/gemini/oauth/auth-url', payload)
    return GeminiAuthUrlResponseDto.fromJson(data)
  }

  async exchangeCode(payload: GeminiExchangeCodeRequest): Promise<GeminiTokenInfoDto> {
    const { data } = await apiClient.post<unknown>('/admin/gemini/oauth/exchange-code', payload)
    return GeminiTokenInfoDto.fromJson(data)
  }
}

export const geminiActionDatasource = new GeminiActionDatasource()
