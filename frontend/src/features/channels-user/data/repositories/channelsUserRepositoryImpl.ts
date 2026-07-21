/**
 * ChannelsUserRepositoryImpl. Auto-generated from channelsUserDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/channels-user/data/datasources/channelsUserDatasource'
import type { ChannelsUserRepository } from '@/features/channels-user/domain/repositories/channelsUserRepository'

export class ChannelsUserRepositoryImpl implements ChannelsUserRepository {
  getAvailable = ds.getAvailable
}

export const channelsUserRepository: ChannelsUserRepository = new ChannelsUserRepositoryImpl()
