/**
 * GroupsUserRepositoryImpl. Auto-generated from groupsUserDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/groups-user/data/datasources/groupsUserDatasource'
import type { GroupsUserRepository } from '@/features/groups-user/domain/repositories/groupsUserRepository'

export class GroupsUserRepositoryImpl implements GroupsUserRepository {
  getAvailable = ds.getAvailable
  getUserGroupRates = ds.getUserGroupRates
}

export const groupsUserRepository: GroupsUserRepository = new GroupsUserRepositoryImpl()
