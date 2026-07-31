import type { UserAvailableChannel } from '@/features/channels-user/domain/models/userAvailableChannel'

export interface ChannelsUserQueryRepository {
  getAvailable(options?: { signal?: AbortSignal }): Promise<UserAvailableChannel[]>
}
