/**
 * AdminChannelMonitorRepository (interface). Auto-generated from adminChannelMonitorDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminChannelMonitorRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorDatasource'

export type AdminChannelMonitorRepository = {
  list: typeof ds.list
  get: typeof ds.get
  create: typeof ds.create
  duplicate: typeof ds.duplicate
  update: typeof ds.update
  del: typeof ds.del
  runNow: typeof ds.runNow
  listHistory: typeof ds.listHistory
}
