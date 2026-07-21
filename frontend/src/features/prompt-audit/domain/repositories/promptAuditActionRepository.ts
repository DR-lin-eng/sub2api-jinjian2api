/**
 * PromptAuditActionRepository (interface). Auto-generated from promptAuditActionDatasource.ts.
 */
import type * as ds from '@/features/prompt-audit/data/datasources/promptAuditActionDatasource'

export type PromptAuditActionRepository = {
  readonly updateConfig: typeof ds.updateConfig
  readonly probeEndpoint: typeof ds.probeEndpoint
  readonly deleteEvent: typeof ds.deleteEvent
  readonly batchDeleteEvents: typeof ds.batchDeleteEvents
  readonly deleteEventsByFilter: typeof ds.deleteEventsByFilter
}
