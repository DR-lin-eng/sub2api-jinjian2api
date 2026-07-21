/**
 * Prompt Audit Action Repository (interface).
 * See promptAuditQueryRepository.ts for the pattern.
 */

import type {
  PromptAuditConfig,
  PromptAuditEndpointDraft,
  PromptAuditUpdateRequest,
  PromptDeletePreview,
  PromptDeleteResult,
  PromptEventFilters,
  PromptProbeResult,
} from '@/features/prompt-audit/domain/models/promptAuditTypes'

export interface PromptAuditActionRepository {
  updateConfig(payload: PromptAuditUpdateRequest): Promise<PromptAuditConfig>
  probeEndpoint(endpoint: PromptAuditEndpointDraft): Promise<PromptProbeResult>
  deleteEvent(id: number): Promise<PromptDeleteResult>
  batchDeleteEvents(ids: number[]): Promise<PromptDeleteResult>
  deleteEventsByFilter(filters: PromptEventFilters, preview: PromptDeletePreview): Promise<PromptDeleteResult>
}
