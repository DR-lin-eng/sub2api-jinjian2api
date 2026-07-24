import { apiClient } from '@/core/networks/client'
import { ErrorPassthroughRuleDto } from '@/features/admin-settings/data/models/errorPassthroughDto'

export class ErrorPassthroughQueryDatasource {
  async list(): Promise<ErrorPassthroughRuleDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/error-passthrough-rules')
    return (data ?? []).map(item => ErrorPassthroughRuleDto.fromJson(item))
  }

  async getById(id: number): Promise<ErrorPassthroughRuleDto> {
    const { data } = await apiClient.get<unknown>(`/admin/error-passthrough-rules/${id}`)
    return ErrorPassthroughRuleDto.fromJson(data)
  }
}

export const errorPassthroughQueryDatasource = new ErrorPassthroughQueryDatasource()
