import { promptAuditActionDatasource as ds } from '@/features/prompt-audit/data/datasources/promptAuditActionDatasource'
import type { PromptAuditActionRepository } from '@/features/prompt-audit/domain/repositories/promptAuditActionRepository'
import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptProbeResult } from '@/features/prompt-audit/domain/models/promptProbeResult'
import type { PromptDeleteResult } from '@/features/prompt-audit/domain/models/promptDeleteResult'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { UpdatePromptAuditConfigRequest } from '@/features/prompt-audit/data/requests_models/updatePromptAuditConfigRequest'

export class PromptAuditActionRepositoryImpl implements PromptAuditActionRepository {
  async updateConfig(req: UpdatePromptAuditConfigRequest): Promise<PromptAuditConfig> {
    return (await ds.updateConfig(req)).toEntity()
  }

  async probeEndpoint(endpoint: PromptAuditEndpointDraft): Promise<PromptProbeResult> {
    return (await ds.probeEndpoint(endpoint)).toEntity()
  }

  async deleteEvent(id: number): Promise<PromptDeleteResult> {
    return (await ds.deleteEvent(id)).toEntity()
  }

  async batchDeleteEvents(ids: number[]): Promise<PromptDeleteResult> {
    return (await ds.batchDeleteEvents(ids)).toEntity()
  }

  async deleteEventsByFilter(filters: PromptEventFilters, preview: PromptDeletePreview): Promise<PromptDeleteResult> {
    return (await ds.deleteEventsByFilter(filters, preview)).toEntity()
  }
}

export const promptAuditActionRepository: PromptAuditActionRepository = new PromptAuditActionRepositoryImpl()
