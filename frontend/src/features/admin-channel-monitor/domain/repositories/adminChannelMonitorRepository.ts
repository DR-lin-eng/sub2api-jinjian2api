/**
 * AdminChannelMonitorRepository (interface). Auto-generated from adminChannelMonitorDatasource.ts.
 */
import type * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorDatasource'

export type AdminChannelMonitorRepository = {
  readonly list: typeof ds.list
  readonly get: typeof ds.get
  readonly create: typeof ds.create
  readonly duplicate: typeof ds.duplicate
  readonly update: typeof ds.update
  readonly del: typeof ds.del
  readonly runNow: typeof ds.runNow
  readonly listHistory: typeof ds.listHistory
}
