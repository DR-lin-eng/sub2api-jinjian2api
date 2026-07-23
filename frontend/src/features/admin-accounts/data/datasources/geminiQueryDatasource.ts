import { apiClient } from '@/core/networks/client'
import { GeminiOAuthCapabilitiesDto } from '@/features/admin-accounts/data/models/geminiOAuthCapabilitiesDto'

export class GeminiQueryDatasource {
  async getCapabilities(): Promise<GeminiOAuthCapabilitiesDto> {
    const { data } = await apiClient.get<unknown>('/admin/gemini/oauth/capabilities')
    return GeminiOAuthCapabilitiesDto.fromJson(data)
  }
}

export const geminiQueryDatasource = new GeminiQueryDatasource()
