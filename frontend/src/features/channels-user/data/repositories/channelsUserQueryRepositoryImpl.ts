import { channelsUserQueryDatasource } from '@/features/channels-user/data/datasources/channelsUserQueryDatasource'
import type { UserAvailableChannel } from '@/features/channels-user/domain/models/userAvailableChannel'
import type { ChannelsUserQueryRepository } from '@/features/channels-user/domain/repositories/channelsUserQueryRepository'

export class ChannelsUserQueryRepositoryImpl implements ChannelsUserQueryRepository {
  private readonly ds = channelsUserQueryDatasource

  async getAvailable(options?: { signal?: AbortSignal }): Promise<UserAvailableChannel[]> {
    return (await this.ds.getAvailable(options)).map(dto => dto.toEntity())
  }
}

export const channelsUserQueryRepository: ChannelsUserQueryRepository = new ChannelsUserQueryRepositoryImpl()
