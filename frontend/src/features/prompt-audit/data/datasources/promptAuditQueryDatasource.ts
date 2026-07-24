import { apiClient } from '@/core/networks/client'
import { PromptAuditConfigDto } from '@/features/prompt-audit/data/models/promptAuditConfigDto'
import { PromptAuditRuntimeDto } from '@/features/prompt-audit/data/models/promptAuditRuntimeDto'
import { PromptAuditEventDto } from '@/features/prompt-audit/data/models/promptAuditEventDto'
import { PromptEventPageDto } from '@/features/prompt-audit/data/models/promptEventPageDto'
import { PromptDeletePreviewDto } from '@/features/prompt-audit/data/models/promptDeletePreviewDto'
import { PromptAuditGroupDto } from '@/features/prompt-audit/data/models/promptAuditGroupDto'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import { eventFilterPayload, eventQueryParams } from '@/features/prompt-audit/data/utils/promptAuditQueryParams'

const basePath = '/admin/prompt-audit'

export class PromptAuditQueryDatasource {
  async getConfig(): Promise<PromptAuditConfigDto> {
    const { data } = await apiClient.get<unknown>(`${basePath}/config`)
    return PromptAuditConfigDto.fromJson(data)
  }

  async getRuntime(): Promise<PromptAuditRuntimeDto> {
    const { data } = await apiClient.get<unknown>(`${basePath}/runtime`)
    return PromptAuditRuntimeDto.fromJson(data)
  }

  async listEvents(filters: PromptEventFilters, page: number, pageSize: number): Promise<PromptEventPageDto> {
    const { data } = await apiClient.get<unknown>(`${basePath}/events`, {
      params: { page, page_size: pageSize, ...eventQueryParams(filters) },
    })
    return PromptEventPageDto.fromJson(data)
  }

  async getEvent(id: number): Promise<PromptAuditEventDto> {
    const { data } = await apiClient.get<unknown>(`${basePath}/events/${id}`)
    return PromptAuditEventDto.fromJson(data)
  }

  async previewDelete(filters: PromptEventFilters): Promise<PromptDeletePreviewDto> {
    const { data } = await apiClient.post<unknown>(
      `${basePath}/events/delete-preview`,
      eventFilterPayload(filters),
    )
    return PromptDeletePreviewDto.fromJson(data)
  }

  async listGroups(): Promise<PromptAuditGroupDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/groups/all', {
      params: { include_inactive: true },
    })
    return (data ?? []).map((item) => PromptAuditGroupDto.fromJson(item))
  }
}

export const promptAuditQueryDatasource = new PromptAuditQueryDatasource()
