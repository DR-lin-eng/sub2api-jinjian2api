/**
 * GroupsUserRepository (interface). Auto-generated from groupsUserDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/groupsUserRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/groups-user/data/datasources/groupsUserDatasource'

export type GroupsUserRepository = {
  getAvailable: typeof ds.getAvailable
  getUserGroupRates: typeof ds.getUserGroupRates
}
