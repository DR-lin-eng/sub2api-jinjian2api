import { apiClient } from '@/core/networks/client'
import { GrokQuotaProbeResultDto } from '@/features/admin-accounts/data/models/grokQuotaProbeResultDto'

export class GrokQueryDatasource {
  async queryQuota(id: number): Promise<GrokQuotaProbeResultDto> {
    const { data } = await apiClient.get<unknown>(`/admin/grok/accounts/${id}/quota`)
    return GrokQuotaProbeResultDto.fromJson(data)
  }
}

export const grokQueryDatasource = new GrokQueryDatasource()
