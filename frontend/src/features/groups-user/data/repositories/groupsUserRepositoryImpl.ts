/**
 * GroupsUserRepositoryImpl. Auto-generated from groupsUserDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/groups-user/data/datasources/groupsUserDatasource'
import type { GroupsUserRepository } from '@/features/groups-user/domain/repositories/groupsUserRepository'

export class GroupsUserRepositoryImpl implements GroupsUserRepository {
  get getAvailable(): typeof ds.getAvailable { return ds.getAvailable }
  get getUserGroupRates(): typeof ds.getUserGroupRates { return ds.getUserGroupRates }
}

export const groupsUserRepository: GroupsUserRepository = new GroupsUserRepositoryImpl()
