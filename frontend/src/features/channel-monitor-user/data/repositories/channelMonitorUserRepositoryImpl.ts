/**
 * ChannelMonitorUserRepositoryImpl. Auto-generated from channelMonitorUserDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/channel-monitor-user/data/datasources/channelMonitorUserDatasource'
import type { ChannelMonitorUserRepository } from '@/features/channel-monitor-user/domain/repositories/channelMonitorUserRepository'

export class ChannelMonitorUserRepositoryImpl implements ChannelMonitorUserRepository {
  list = ds.list
  status = ds.status
  statusBatch = ds.statusBatch
}

export const channelMonitorUserRepository: ChannelMonitorUserRepository = new ChannelMonitorUserRepositoryImpl()
