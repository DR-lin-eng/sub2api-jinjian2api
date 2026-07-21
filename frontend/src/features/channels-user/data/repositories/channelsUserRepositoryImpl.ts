/**
 * ChannelsUserRepositoryImpl. Auto-generated from channelsUserDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/channels-user/data/datasources/channelsUserDatasource'
import type { ChannelsUserRepository } from '@/features/channels-user/domain/repositories/channelsUserRepository'

export class ChannelsUserRepositoryImpl implements ChannelsUserRepository {
  get getAvailable(): typeof ds.getAvailable { return ds.getAvailable }
}

export const channelsUserRepository: ChannelsUserRepository = new ChannelsUserRepositoryImpl()
