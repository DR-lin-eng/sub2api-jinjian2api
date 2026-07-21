/**
 * Prompt Audit Action Repository (implementation).
 */

import * as ds from '@/features/prompt-audit/data/datasources/promptAuditActionDatasource'
import type { PromptAuditActionRepository } from '@/features/prompt-audit/domain/repositories/promptAuditActionRepository'
import type {
  PromptAuditConfig,
  PromptAuditEndpointDraft,
  PromptAuditUpdateRequest,
  PromptDeletePreview,
  PromptDeleteResult,
  PromptEventFilters,
  PromptProbeResult,
} from '@/features/prompt-audit/domain/models/promptAuditTypes'

export class PromptAuditActionRepositoryImpl implements PromptAuditActionRepository {
  updateConfig(payload: PromptAuditUpdateRequest): Promise<PromptAuditConfig> {
    return ds.updateConfig(payload)
  }
  probeEndpoint(endpoint: PromptAuditEndpointDraft): Promise<PromptProbeResult> {
    return ds.probeEndpoint(endpoint)
  }
  deleteEvent(id: number): Promise<PromptDeleteResult> {
    return ds.deleteEvent(id)
  }
  batchDeleteEvents(ids: number[]): Promise<PromptDeleteResult> {
    return ds.batchDeleteEvents(ids)
  }
  deleteEventsByFilter(filters: PromptEventFilters, preview: PromptDeletePreview): Promise<PromptDeleteResult> {
    return ds.deleteEventsByFilter(filters, preview)
  }
}
