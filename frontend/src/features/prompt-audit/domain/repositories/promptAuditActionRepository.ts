import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptProbeResult } from '@/features/prompt-audit/domain/models/promptProbeResult'
import type { PromptDeleteResult } from '@/features/prompt-audit/domain/models/promptDeleteResult'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { UpdatePromptAuditConfigRequest } from '@/features/prompt-audit/data/requests_models/updatePromptAuditConfigRequest'

export interface PromptAuditActionRepository {
  updateConfig(req: UpdatePromptAuditConfigRequest): Promise<PromptAuditConfig>
  probeEndpoint(endpoint: PromptAuditEndpointDraft): Promise<PromptProbeResult>
  deleteEvent(id: number): Promise<PromptDeleteResult>
  batchDeleteEvents(ids: number[]): Promise<PromptDeleteResult>
  deleteEventsByFilter(filters: PromptEventFilters, preview: PromptDeletePreview): Promise<PromptDeleteResult>
}
