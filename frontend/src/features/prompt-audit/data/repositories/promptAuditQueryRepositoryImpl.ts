/**
 * PromptAuditQueryRepositoryImpl. Auto-generated from promptAuditQueryDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/prompt-audit/data/datasources/promptAuditQueryDatasource'
import type { PromptAuditQueryRepository } from '@/features/prompt-audit/domain/repositories/promptAuditQueryRepository'

export class PromptAuditQueryRepositoryImpl implements PromptAuditQueryRepository {
  get getConfig(): typeof ds.getConfig { return ds.getConfig }
  get getRuntime(): typeof ds.getRuntime { return ds.getRuntime }
  get listEvents(): typeof ds.listEvents { return ds.listEvents }
  get getEvent(): typeof ds.getEvent { return ds.getEvent }
  get previewDelete(): typeof ds.previewDelete { return ds.previewDelete }
  get listGroups(): typeof ds.listGroups { return ds.listGroups }
}

export const promptAuditQueryRepository: PromptAuditQueryRepository = new PromptAuditQueryRepositoryImpl()
