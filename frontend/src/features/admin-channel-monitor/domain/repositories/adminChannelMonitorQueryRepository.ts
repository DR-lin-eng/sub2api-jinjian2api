/**
 * AdminChannelMonitorQueryRepository — read side (monitors + templates).
 */
import type {ChannelMonitor} from '@/features/admin-channel-monitor/domain/models/channelMonitor'
import type {ChannelMonitorListParams} from '@/features/admin-channel-monitor/domain/models/channelMonitorListParams'
import type {
    ChannelMonitorListResponse
} from '@/features/admin-channel-monitor/domain/models/channelMonitorListResponse'
import type {ChannelMonitorTemplate} from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplate'
import type {
    ChannelMonitorTemplateListParams
} from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplateListParams'
import type {
    ChannelMonitorTemplateListResponse
} from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplateListResponse'
import type {
    AssociatedMonitorsResponse
} from '@/features/admin-channel-monitor/domain/models/associatedMonitorsResponse'
import type {HistoryParams} from '@/features/admin-channel-monitor/domain/models/historyParams'
import type {HistoryResponse} from '@/features/admin-channel-monitor/domain/models/historyResponse'

export interface AdminChannelMonitorQueryRepository {
    list(
        params?: ChannelMonitorListParams,
        options?: { signal?: AbortSignal },
    ): Promise<ChannelMonitorListResponse>

    getById(id: number): Promise<ChannelMonitor>

    listHistory(id: number, params?: HistoryParams): Promise<HistoryResponse>

    listTemplates(
        params?: ChannelMonitorTemplateListParams,
    ): Promise<ChannelMonitorTemplateListResponse>

    getTemplateById(id: number): Promise<ChannelMonitorTemplate>

    listAssociatedMonitors(id: number): Promise<AssociatedMonitorsResponse>
}
