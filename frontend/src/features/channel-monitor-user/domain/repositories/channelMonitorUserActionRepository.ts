import type { UserMonitorDetail } from '@/features/channel-monitor-user/domain/models/userMonitorDetail'
import type { StatusBatchRequest } from '@/features/channel-monitor-user/data/requests_models/statusBatchRequest'

export interface ChannelMonitorUserActionRepository {
  status(id: number): Promise<UserMonitorDetail>
  statusBatch(req: StatusBatchRequest): Promise<UserMonitorDetail[]>
}
