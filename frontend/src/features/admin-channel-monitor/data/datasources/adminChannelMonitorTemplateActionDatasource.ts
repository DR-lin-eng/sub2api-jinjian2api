import { apiClient } from '@/core/networks/client'
import { ApplyTemplateResponseDto } from '@/features/admin-channel-monitor/data/models/applyTemplateResponseDto'
import { ChannelMonitorTemplateDto } from '@/features/admin-channel-monitor/data/models/channelMonitorTemplateDto'
import type { CreateChannelMonitorTemplateRequest } from '@/features/admin-channel-monitor/data/requests_models/createChannelMonitorTemplateRequest'
import type { UpdateChannelMonitorTemplateRequest } from '@/features/admin-channel-monitor/data/requests_models/updateChannelMonitorTemplateRequest'

export class AdminChannelMonitorTemplateActionDatasource {
  async create(req: CreateChannelMonitorTemplateRequest): Promise<ChannelMonitorTemplateDto> {
    const { data } = await apiClient.post<unknown>('/admin/channel-monitor-templates', req)
    return ChannelMonitorTemplateDto.fromJson(data)
  }

  async update(
    id: number,
    req: UpdateChannelMonitorTemplateRequest,
  ): Promise<ChannelMonitorTemplateDto> {
    const { data } = await apiClient.put<unknown>(
      `/admin/channel-monitor-templates/${id}`,
      req,
    )
    return ChannelMonitorTemplateDto.fromJson(data)
  }

  async del(id: number): Promise<void> {
    await apiClient.delete(`/admin/channel-monitor-templates/${id}`)
  }

  async apply(id: number, monitorIds: number[]): Promise<ApplyTemplateResponseDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/channel-monitor-templates/${id}/apply`,
      { monitor_ids: monitorIds },
    )
    return ApplyTemplateResponseDto.fromJson(data)
  }
}

export const adminChannelMonitorTemplateActionDatasource =
  new AdminChannelMonitorTemplateActionDatasource()
