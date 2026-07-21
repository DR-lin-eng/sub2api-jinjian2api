/**
 * ChannelsUserRepository (interface). Auto-generated from channelsUserDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/channelsUserRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/channels-user/data/datasources/channelsUserDatasource'

export type ChannelsUserRepository = {
  getAvailable: typeof ds.getAvailable
}
