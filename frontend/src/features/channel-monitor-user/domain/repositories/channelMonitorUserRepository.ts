/**
 * ChannelMonitorUserRepository (interface). Auto-generated from channelMonitorUserDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/channelMonitorUserRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/channel-monitor-user/data/datasources/channelMonitorUserDatasource'

export type ChannelMonitorUserRepository = {
  list: typeof ds.list
  status: typeof ds.status
  statusBatch: typeof ds.statusBatch
}
