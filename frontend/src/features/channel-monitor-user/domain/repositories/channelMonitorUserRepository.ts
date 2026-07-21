/**
 * ChannelMonitorUserRepository (interface). Auto-generated from channelMonitorUserDatasource.ts.
 */
import type * as ds from '@/features/channel-monitor-user/data/datasources/channelMonitorUserDatasource'

export type ChannelMonitorUserRepository = {
  readonly list: typeof ds.list
  readonly status: typeof ds.status
  readonly statusBatch: typeof ds.statusBatch
}
