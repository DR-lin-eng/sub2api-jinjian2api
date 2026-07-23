import type { ApplyTemplateResponse } from '@/features/admin-channel-monitor/domain/models/applyTemplateResponse'
import type { ChannelMonitor } from '@/features/admin-channel-monitor/domain/models/channelMonitor'
import type { ChannelMonitorTemplate } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplate'
import type { RunNowResponse } from '@/features/admin-channel-monitor/domain/models/runNowResponse'
import type { CreateChannelMonitorRequest } from '@/features/admin-channel-monitor/data/requests_models/createChannelMonitorRequest'
import type { UpdateChannelMonitorRequest } from '@/features/admin-channel-monitor/data/requests_models/updateChannelMonitorRequest'
import type { CreateChannelMonitorTemplateRequest } from '@/features/admin-channel-monitor/data/requests_models/createChannelMonitorTemplateRequest'
import type { UpdateChannelMonitorTemplateRequest } from '@/features/admin-channel-monitor/data/requests_models/updateChannelMonitorTemplateRequest'

export interface AdminChannelMonitorActionRepository {
  create(payload: CreateChannelMonitorRequest): Promise<ChannelMonitor>
  update(id: number, payload: UpdateChannelMonitorRequest): Promise<ChannelMonitor>
  deleteMonitor(id: number): Promise<void>
  runNow(id: number): Promise<RunNowResponse>
  duplicate(id: number): Promise<ChannelMonitor>

  createTemplate(payload: CreateChannelMonitorTemplateRequest): Promise<ChannelMonitorTemplate>
  updateTemplate(
    id: number,
    payload: UpdateChannelMonitorTemplateRequest,
  ): Promise<ChannelMonitorTemplate>
  deleteTemplate(id: number): Promise<void>
  applyTemplate(id: number, monitorIds: number[]): Promise<ApplyTemplateResponse>
}
