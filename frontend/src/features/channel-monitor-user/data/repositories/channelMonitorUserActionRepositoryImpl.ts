import { channelMonitorUserActionDatasource } from '@/features/channel-monitor-user/data/datasources/channelMonitorUserActionDatasource'
import type { ChannelMonitorUserActionRepository } from '@/features/channel-monitor-user/domain/repositories/channelMonitorUserActionRepository'
import type { StatusBatchRequest } from '@/features/channel-monitor-user/data/requests_models/statusBatchRequest'

export class ChannelMonitorUserActionRepositoryImpl implements ChannelMonitorUserActionRepository {
  private readonly ds = channelMonitorUserActionDatasource

  async status(id: number) {
    return (await this.ds.status(id)).toEntity()
  }

  async statusBatch(req: StatusBatchRequest) {
    return (await this.ds.statusBatch(req)).map(dto => dto.toEntity())
  }
}

export const channelMonitorUserActionRepository: ChannelMonitorUserActionRepository =
  new ChannelMonitorUserActionRepositoryImpl()
