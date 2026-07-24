import { apiClient } from '@/core/networks/client'
import { ErrorPassthroughRuleDto } from '@/features/admin-settings/data/models/errorPassthroughDto'
import type { CreateErrorPassthroughRuleRequest } from '@/features/admin-settings/data/requests_models/createErrorPassthroughRuleRequest'
import type { UpdateErrorPassthroughRuleRequest } from '@/features/admin-settings/data/requests_models/updateErrorPassthroughRuleRequest'

export class ErrorPassthroughActionDatasource {
  async create(req: CreateErrorPassthroughRuleRequest): Promise<ErrorPassthroughRuleDto> {
    const { data } = await apiClient.post<unknown>('/admin/error-passthrough-rules', req)
    return ErrorPassthroughRuleDto.fromJson(data)
  }

  async update(id: number, req: UpdateErrorPassthroughRuleRequest): Promise<ErrorPassthroughRuleDto> {
    const { data } = await apiClient.put<unknown>(`/admin/error-passthrough-rules/${id}`, req)
    return ErrorPassthroughRuleDto.fromJson(data)
  }

  async deleteRule(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/error-passthrough-rules/${id}`)
    return data
  }

  async toggleEnabled(id: number, enabled: boolean): Promise<ErrorPassthroughRuleDto> {
    return this.update(id, { enabled })
  }
}

export const errorPassthroughActionDatasource = new ErrorPassthroughActionDatasource()
