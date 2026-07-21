/**
 * AdminChannelMonitorTemplateRepository (interface). Auto-generated from adminChannelMonitorTemplateDatasource.ts.
 */
import type * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateDatasource'

export type AdminChannelMonitorTemplateRepository = {
  readonly list: typeof ds.list
  readonly get: typeof ds.get
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly del: typeof ds.del
  readonly apply: typeof ds.apply
  readonly listAssociatedMonitors: typeof ds.listAssociatedMonitors
}
