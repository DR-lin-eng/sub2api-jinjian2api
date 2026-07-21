/**
 * ChannelMonitorUserRepositoryImpl. Auto-generated from channelMonitorUserDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/channel-monitor-user/data/datasources/channelMonitorUserDatasource'
import type { ChannelMonitorUserRepository } from '@/features/channel-monitor-user/domain/repositories/channelMonitorUserRepository'

export class ChannelMonitorUserRepositoryImpl implements ChannelMonitorUserRepository {
  get list(): typeof ds.list { return ds.list }
  get status(): typeof ds.status { return ds.status }
  get statusBatch(): typeof ds.statusBatch { return ds.statusBatch }
}

export const channelMonitorUserRepository: ChannelMonitorUserRepository = new ChannelMonitorUserRepositoryImpl()
