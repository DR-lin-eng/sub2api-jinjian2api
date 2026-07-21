/**
 * Prompt Audit Query Repository (implementation).
 * Per spec §5.2 R4: this file is the ONLY code allowed to directly call the
 * datasource. Presentation goes through PromptAuditQueryRepository interface.
 */

import * as ds from '@/features/prompt-audit/data/datasources/promptAuditQueryDatasource'
import type { PromptAuditQueryRepository } from '@/features/prompt-audit/domain/repositories/promptAuditQueryRepository'
import type {
  PromptAuditConfig,
  PromptAuditEvent,
  PromptAuditGroup,
  PromptAuditRuntime,
  PromptDeletePreview,
  PromptEventFilters,
  PromptEventPage,
} from '@/features/prompt-audit/domain/models/promptAuditTypes'

export class PromptAuditQueryRepositoryImpl implements PromptAuditQueryRepository {
  getConfig(): Promise<PromptAuditConfig> {
    return ds.getConfig()
  }
  getRuntime(): Promise<PromptAuditRuntime> {
    return ds.getRuntime()
  }
  listEvents(filters: PromptEventFilters, page: number, pageSize: number): Promise<PromptEventPage> {
    return ds.listEvents(filters, page, pageSize)
  }
  getEvent(id: number): Promise<PromptAuditEvent> {
    return ds.getEvent(id)
  }
  previewDelete(filters: PromptEventFilters): Promise<PromptDeletePreview> {
    return ds.previewDelete(filters)
  }
  listGroups(): Promise<PromptAuditGroup[]> {
    return ds.listGroups()
  }
}
