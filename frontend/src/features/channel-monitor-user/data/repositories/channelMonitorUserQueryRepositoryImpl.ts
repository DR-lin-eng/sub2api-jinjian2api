import { channelMonitorUserQueryDatasource } from '@/features/channel-monitor-user/data/datasources/channelMonitorUserQueryDatasource'
import type { ChannelMonitorUserQueryRepository } from '@/features/channel-monitor-user/domain/repositories/channelMonitorUserQueryRepository'

export class ChannelMonitorUserQueryRepositoryImpl implements ChannelMonitorUserQueryRepository {
  private readonly ds = channelMonitorUserQueryDatasource

  list = async (options?: { signal?: AbortSignal }) => {
    return (await this.ds.list(options)).map(dto => dto.toEntity())
  }
}

export const channelMonitorUserQueryRepository: ChannelMonitorUserQueryRepository =
  new ChannelMonitorUserQueryRepositoryImpl()
