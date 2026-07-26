import {
  adminChannelMonitorActionDatasource,
  type AdminChannelMonitorActionDatasource,
} from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorActionDatasource'
import {
  adminChannelMonitorTemplateActionDatasource,
  type AdminChannelMonitorTemplateActionDatasource,
} from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateActionDatasource'
import type { ApplyTemplateResponse } from '@/features/admin-channel-monitor/domain/models/applyTemplateResponse'
import type { ChannelMonitor } from '@/features/admin-channel-monitor/domain/models/channelMonitor'
import type { ChannelMonitorTemplate } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplate'
import type { RunNowResponse } from '@/features/admin-channel-monitor/domain/models/runNowResponse'
import type { CreateChannelMonitorRequest } from '@/features/admin-channel-monitor/data/requests_models/createChannelMonitorRequest'
import type { UpdateChannelMonitorRequest } from '@/features/admin-channel-monitor/data/requests_models/updateChannelMonitorRequest'
import type { CreateChannelMonitorTemplateRequest } from '@/features/admin-channel-monitor/data/requests_models/createChannelMonitorTemplateRequest'
import type { UpdateChannelMonitorTemplateRequest } from '@/features/admin-channel-monitor/data/requests_models/updateChannelMonitorTemplateRequest'
import type { AdminChannelMonitorActionRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorActionRepository'

export class AdminChannelMonitorActionRepositoryImpl
  implements AdminChannelMonitorActionRepository
{
  constructor(
    private readonly monitorDs: AdminChannelMonitorActionDatasource = adminChannelMonitorActionDatasource,
    private readonly templateDs: AdminChannelMonitorTemplateActionDatasource = adminChannelMonitorTemplateActionDatasource,
  ) {}

  create = async (req: CreateChannelMonitorRequest) : Promise<ChannelMonitor>  => {
    return (await this.monitorDs.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateChannelMonitorRequest) : Promise<ChannelMonitor>  => {
    return (await this.monitorDs.update(id, req)).toEntity()
  }

  deleteMonitor = async (id: number) : Promise<void>  => {
    await this.monitorDs.del(id)
  }

  runNow = async (id: number) : Promise<RunNowResponse>  => {
    return (await this.monitorDs.runNow(id)).toEntity()
  }

  duplicate = async (id: number) : Promise<ChannelMonitor>  => {
    return (await this.monitorDs.duplicate(id)).toEntity()
  }

  createTemplate = async (req: CreateChannelMonitorTemplateRequest) : Promise<ChannelMonitorTemplate>  => {
    return (await this.templateDs.create(req)).toEntity()
  }

  updateTemplate = async (
    id: number,
    req: UpdateChannelMonitorTemplateRequest,
  ): Promise<ChannelMonitorTemplate> => {
    return (await this.templateDs.update(id, req)).toEntity()
  }

  deleteTemplate = async (id: number) : Promise<void>  => {
    await this.templateDs.del(id)
  }

  applyTemplate = async (id: number, monitorIds: number[]) : Promise<ApplyTemplateResponse>  => {
    return (await this.templateDs.apply(id, monitorIds)).toEntity()
  }
}

export const adminChannelMonitorActionRepository: AdminChannelMonitorActionRepository =
  new AdminChannelMonitorActionRepositoryImpl()
