/**
 * AdminChannelMonitorTemplateRepository (interface). Auto-generated from adminChannelMonitorTemplateDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminChannelMonitorTemplateRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateDatasource'

export type AdminChannelMonitorTemplateRepository = {
  list: typeof ds.list
  get: typeof ds.get
  create: typeof ds.create
  update: typeof ds.update
  del: typeof ds.del
  apply: typeof ds.apply
  listAssociatedMonitors: typeof ds.listAssociatedMonitors
}
