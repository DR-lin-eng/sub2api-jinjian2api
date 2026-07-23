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

  async create(req: CreateChannelMonitorRequest): Promise<ChannelMonitor> {
    return (await this.monitorDs.create(req)).toEntity()
  }

  async update(id: number, req: UpdateChannelMonitorRequest): Promise<ChannelMonitor> {
    return (await this.monitorDs.update(id, req)).toEntity()
  }

  async deleteMonitor(id: number): Promise<void> {
    await this.monitorDs.del(id)
  }

  async runNow(id: number): Promise<RunNowResponse> {
    return (await this.monitorDs.runNow(id)).toEntity()
  }

  async duplicate(id: number): Promise<ChannelMonitor> {
    return (await this.monitorDs.duplicate(id)).toEntity()
  }

  async createTemplate(req: CreateChannelMonitorTemplateRequest): Promise<ChannelMonitorTemplate> {
    return (await this.templateDs.create(req)).toEntity()
  }

  async updateTemplate(
    id: number,
    req: UpdateChannelMonitorTemplateRequest,
  ): Promise<ChannelMonitorTemplate> {
    return (await this.templateDs.update(id, req)).toEntity()
  }

  async deleteTemplate(id: number): Promise<void> {
    await this.templateDs.del(id)
  }

  async applyTemplate(id: number, monitorIds: number[]): Promise<ApplyTemplateResponse> {
    return (await this.templateDs.apply(id, monitorIds)).toEntity()
  }
}

export const adminChannelMonitorActionRepository: AdminChannelMonitorActionRepository =
  new AdminChannelMonitorActionRepositoryImpl()
