/**
 * PromptAuditActionRepositoryImpl. Auto-generated from promptAuditActionDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/prompt-audit/data/datasources/promptAuditActionDatasource'
import type { PromptAuditActionRepository } from '@/features/prompt-audit/domain/repositories/promptAuditActionRepository'

export class PromptAuditActionRepositoryImpl implements PromptAuditActionRepository {
  get updateConfig(): typeof ds.updateConfig { return ds.updateConfig }
  get probeEndpoint(): typeof ds.probeEndpoint { return ds.probeEndpoint }
  get deleteEvent(): typeof ds.deleteEvent { return ds.deleteEvent }
  get batchDeleteEvents(): typeof ds.batchDeleteEvents { return ds.batchDeleteEvents }
  get deleteEventsByFilter(): typeof ds.deleteEventsByFilter { return ds.deleteEventsByFilter }
}

export const promptAuditActionRepository: PromptAuditActionRepository = new PromptAuditActionRepositoryImpl()
