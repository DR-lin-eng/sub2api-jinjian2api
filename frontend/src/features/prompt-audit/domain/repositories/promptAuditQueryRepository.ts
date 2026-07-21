/**
 * Prompt Audit Query Repository (interface)
 *
 * Per spec §5.2 R4: interface lives in domain/repositories, implementation
 * lives in data/repositories/*Impl. Presentation code (Store/Composable/Page)
 * MUST depend on this interface, never the impl.
 */

import type {
  PromptAuditConfig,
  PromptAuditEvent,
  PromptAuditGroup,
  PromptAuditRuntime,
  PromptDeletePreview,
  PromptEventFilters,
  PromptEventPage,
} from '@/features/prompt-audit/domain/models/promptAuditTypes'

export interface PromptAuditQueryRepository {
  getConfig(): Promise<PromptAuditConfig>
  getRuntime(): Promise<PromptAuditRuntime>
  listEvents(filters: PromptEventFilters, page: number, pageSize: number): Promise<PromptEventPage>
  getEvent(id: number): Promise<PromptAuditEvent>
  previewDelete(filters: PromptEventFilters): Promise<PromptDeletePreview>
  listGroups(): Promise<PromptAuditGroup[]>
}
