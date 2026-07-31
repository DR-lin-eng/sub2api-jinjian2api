import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptAuditRuntime } from '@/features/prompt-audit/domain/models/promptAuditRuntime'
import type { PromptAuditEvent } from '@/features/prompt-audit/domain/models/promptAuditEvent'
import type { PromptEventPage } from '@/features/prompt-audit/domain/models/promptEventPage'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptAuditGroup } from '@/features/prompt-audit/domain/models/promptAuditGroup'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'

export interface PromptAuditQueryRepository {
  getConfig(): Promise<PromptAuditConfig>
  getRuntime(): Promise<PromptAuditRuntime>
  listEvents(filters: PromptEventFilters, page: number, pageSize: number): Promise<PromptEventPage>
  getEvent(id: number): Promise<PromptAuditEvent>
  previewDelete(filters: PromptEventFilters): Promise<PromptDeletePreview>
  listGroups(): Promise<PromptAuditGroup[]>
}
