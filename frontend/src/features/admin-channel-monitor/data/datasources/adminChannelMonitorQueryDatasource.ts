import { apiClient } from '@/core/networks/client'
import { ChannelMonitorDto } from '@/features/admin-channel-monitor/data/models/channelMonitorDto'
import { ChannelMonitorListResponseDto } from '@/features/admin-channel-monitor/data/models/channelMonitorListResponseDto'
import { HistoryResponseDto } from '@/features/admin-channel-monitor/data/models/historyResponseDto'
import type { ChannelMonitorListParams } from '@/features/admin-channel-monitor/domain/models/channelMonitorListParams'
import type { HistoryParams } from '@/features/admin-channel-monitor/domain/models/historyParams'

export class AdminChannelMonitorQueryDatasource {
  async list(
    params: ChannelMonitorListParams = {},
    options?: { signal?: AbortSignal },
  ): Promise<ChannelMonitorListResponseDto> {
    const query: Record<string, unknown> = {}
    if (params.page !== undefined) query.page = params.page
    if (params.pageSize !== undefined) query.page_size = params.pageSize
    if (params.provider !== undefined) query.provider = params.provider
    if (params.enabled !== undefined) query.enabled = params.enabled
    if (params.search !== undefined) query.search = params.search

    const { data } = await apiClient.get<unknown>('/admin/channel-monitors', {
      params: query,
      signal: options?.signal,
    })
    return ChannelMonitorListResponseDto.fromJson(data)
  }

  async getById(id: number): Promise<ChannelMonitorDto> {
    const { data } = await apiClient.get<unknown>(`/admin/channel-monitors/${id}`)
    return ChannelMonitorDto.fromJson(data)
  }

  async listHistory(id: number, params: HistoryParams = {}): Promise<HistoryResponseDto> {
    const query: Record<string, unknown> = {}
    if (params.model !== undefined) query.model = params.model
    if (params.limit !== undefined) query.limit = params.limit

    const { data } = await apiClient.get<unknown>(`/admin/channel-monitors/${id}/history`, {
      params: query,
    })
    return HistoryResponseDto.fromJson(data)
  }
}

export const adminChannelMonitorQueryDatasource = new AdminChannelMonitorQueryDatasource()
