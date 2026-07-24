import { apiClient } from '@/core/networks/client'
import { PromptAuditConfigDto } from '@/features/prompt-audit/data/models/promptAuditConfigDto'
import { PromptProbeResultDto } from '@/features/prompt-audit/data/models/promptProbeResultDto'
import { PromptDeleteResultDto } from '@/features/prompt-audit/data/models/promptDeleteResultDto'
import type { UpdatePromptAuditConfigRequest } from '@/features/prompt-audit/data/requests_models/updatePromptAuditConfigRequest'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import { eventFilterPayload } from '@/features/prompt-audit/data/utils/promptAuditQueryParams'

const basePath = '/admin/prompt-audit'

export class PromptAuditActionDatasource {
  async updateConfig(req: UpdatePromptAuditConfigRequest): Promise<PromptAuditConfigDto> {
    const { data } = await apiClient.put<unknown>(`${basePath}/config`, req)
    return PromptAuditConfigDto.fromJson(data)
  }

  async probeEndpoint(endpoint: PromptAuditEndpointDraft): Promise<PromptProbeResultDto> {
    const { data } = await apiClient.post<unknown>(`${basePath}/endpoints/probe`, {
      endpoint: {
        id: endpoint.id,
        name: endpoint.name,
        protocol: 'openai_compatible',
        base_url: endpoint.baseUrl,
        model: endpoint.model,
        token: endpoint.token || undefined,
        timeout_ms: endpoint.timeoutMs,
        input_limit: endpoint.inputLimit,
        enabled: endpoint.enabled,
      },
    })
    return PromptProbeResultDto.fromJson(data)
  }

  async deleteEvent(id: number): Promise<PromptDeleteResultDto> {
    const { data } = await apiClient.delete<unknown>(`${basePath}/events/${id}`)
    return PromptDeleteResultDto.fromJson(data)
  }

  async batchDeleteEvents(ids: number[]): Promise<PromptDeleteResultDto> {
    const { data } = await apiClient.post<unknown>(`${basePath}/events/batch-delete`, { ids })
    return PromptDeleteResultDto.fromJson(data)
  }

  async deleteEventsByFilter(filters: PromptEventFilters, preview: PromptDeletePreview): Promise<PromptDeleteResultDto> {
    const { data } = await apiClient.post<unknown>(`${basePath}/events/delete-by-filter`, {
      filter: eventFilterPayload(filters),
      snapshot_max_id: preview.snapshotMaxId,
      filter_hash: preview.filterHash,
      confirmation_token: preview.confirmationToken,
      confirm: true,
    })
    return PromptDeleteResultDto.fromJson(data)
  }
}

export const promptAuditActionDatasource = new PromptAuditActionDatasource()
