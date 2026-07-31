import { apiClient } from '@/core/networks/client'
import { UserMonitorDetailDto } from '@/features/channel-monitor-user/data/models/userMonitorDetailDto'
import type { StatusBatchRequest } from '@/features/channel-monitor-user/data/requests_models/statusBatchRequest'

export class ChannelMonitorUserActionDatasource {
  async status(id: number): Promise<UserMonitorDetailDto> {
    const { data } = await apiClient.get<unknown>(`/channel-monitors/${id}/status`)
    return UserMonitorDetailDto.fromJson(data)
  }

  async statusBatch(req: StatusBatchRequest): Promise<UserMonitorDetailDto[]> {
    const { data } = await apiClient.post<{ items: unknown[] }>(
      '/channel-monitors/status/batch',
      req,
    )
    return (data.items ?? []).map(item => UserMonitorDetailDto.fromJson(item))
  }
}

export const channelMonitorUserActionDatasource = new ChannelMonitorUserActionDatasource()
