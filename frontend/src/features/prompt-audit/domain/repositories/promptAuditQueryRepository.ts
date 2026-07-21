/**
 * PromptAuditQueryRepository (interface). Auto-generated from promptAuditQueryDatasource.ts.
 */
import type * as ds from '@/features/prompt-audit/data/datasources/promptAuditQueryDatasource'

export type PromptAuditQueryRepository = {
  readonly getConfig: typeof ds.getConfig
  readonly getRuntime: typeof ds.getRuntime
  readonly listEvents: typeof ds.listEvents
  readonly getEvent: typeof ds.getEvent
  readonly previewDelete: typeof ds.previewDelete
  readonly listGroups: typeof ds.listGroups
}
