import { apiClient } from '@/core/networks/client'
import { AssociatedMonitorsResponseDto } from '@/features/admin-channel-monitor/data/models/associatedMonitorsResponseDto'
import { ChannelMonitorTemplateDto } from '@/features/admin-channel-monitor/data/models/channelMonitorTemplateDto'
import { ChannelMonitorTemplateListResponseDto } from '@/features/admin-channel-monitor/data/models/channelMonitorTemplateListResponseDto'
import type { ChannelMonitorTemplateListParams } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplateListParams'

export class AdminChannelMonitorTemplateQueryDatasource {
  async list(
    params: ChannelMonitorTemplateListParams = {},
  ): Promise<ChannelMonitorTemplateListResponseDto> {
    const query: Record<string, unknown> = {}
    if (params.provider !== undefined) query.provider = params.provider
    if (params.apiMode !== undefined) query.api_mode = params.apiMode

    const { data } = await apiClient.get<unknown>('/admin/channel-monitor-templates', {
      params: query,
    })
    return ChannelMonitorTemplateListResponseDto.fromJson(data)
  }

  async getById(id: number): Promise<ChannelMonitorTemplateDto> {
    const { data } = await apiClient.get<unknown>(`/admin/channel-monitor-templates/${id}`)
    return ChannelMonitorTemplateDto.fromJson(data)
  }

  async listAssociatedMonitors(id: number): Promise<AssociatedMonitorsResponseDto> {
    const { data } = await apiClient.get<unknown>(
      `/admin/channel-monitor-templates/${id}/monitors`,
    )
    return AssociatedMonitorsResponseDto.fromJson(data)
  }
}

export const adminChannelMonitorTemplateQueryDatasource =
  new AdminChannelMonitorTemplateQueryDatasource()
