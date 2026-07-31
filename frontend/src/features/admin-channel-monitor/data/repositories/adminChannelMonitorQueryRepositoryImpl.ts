import {
  adminChannelMonitorQueryDatasource,
  type AdminChannelMonitorQueryDatasource,
} from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorQueryDatasource'
import {
  adminChannelMonitorTemplateQueryDatasource,
  type AdminChannelMonitorTemplateQueryDatasource,
} from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateQueryDatasource'
import type { ChannelMonitor } from '@/features/admin-channel-monitor/domain/models/channelMonitor'
import type { ChannelMonitorListParams } from '@/features/admin-channel-monitor/domain/models/channelMonitorListParams'
import type { ChannelMonitorListResponse } from '@/features/admin-channel-monitor/domain/models/channelMonitorListResponse'
import type { ChannelMonitorTemplate } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplate'
import type { ChannelMonitorTemplateListParams } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplateListParams'
import type { ChannelMonitorTemplateListResponse } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplateListResponse'
import type { AssociatedMonitorsResponse } from '@/features/admin-channel-monitor/domain/models/associatedMonitorsResponse'
import type { HistoryParams } from '@/features/admin-channel-monitor/domain/models/historyParams'
import type { HistoryResponse } from '@/features/admin-channel-monitor/domain/models/historyResponse'
import type { AdminChannelMonitorQueryRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorQueryRepository'

export class AdminChannelMonitorQueryRepositoryImpl implements AdminChannelMonitorQueryRepository {
  constructor(
    private readonly monitorDs: AdminChannelMonitorQueryDatasource = adminChannelMonitorQueryDatasource,
    private readonly templateDs: AdminChannelMonitorTemplateQueryDatasource = adminChannelMonitorTemplateQueryDatasource,
  ) {}

  list = async (
    params: ChannelMonitorListParams = {},
    options?: { signal?: AbortSignal },
  ): Promise<ChannelMonitorListResponse> => {
    return (await this.monitorDs.list(params, options)).toEntity()
  }

  getById = async (id: number) : Promise<ChannelMonitor>  => {
    return (await this.monitorDs.getById(id)).toEntity()
  }

  listHistory = async (id: number, params: HistoryParams = {}) : Promise<HistoryResponse>  => {
    return (await this.monitorDs.listHistory(id, params)).toEntity()
  }

  listTemplates = async (
    params: ChannelMonitorTemplateListParams = {},
  ): Promise<ChannelMonitorTemplateListResponse> => {
    return (await this.templateDs.list(params)).toEntity()
  }

  getTemplateById = async (id: number) : Promise<ChannelMonitorTemplate>  => {
    return (await this.templateDs.getById(id)).toEntity()
  }

  listAssociatedMonitors = async (id: number) : Promise<AssociatedMonitorsResponse>  => {
    return (await this.templateDs.listAssociatedMonitors(id)).toEntity()
  }
}

export const adminChannelMonitorQueryRepository: AdminChannelMonitorQueryRepository =
  new AdminChannelMonitorQueryRepositoryImpl()
