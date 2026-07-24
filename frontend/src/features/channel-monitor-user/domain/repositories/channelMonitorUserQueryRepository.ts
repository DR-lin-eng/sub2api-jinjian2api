import type { UserMonitorView } from '@/features/channel-monitor-user/domain/models/userMonitorView'

export interface ChannelMonitorUserQueryRepository {
  list(options?: { signal?: AbortSignal }): Promise<UserMonitorView[]>
}
