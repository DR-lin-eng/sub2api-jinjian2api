/**
 * GroupsUserRepository (interface). Auto-generated from groupsUserDatasource.ts.
 */
import type * as ds from '@/features/groups-user/data/datasources/groupsUserDatasource'

export type GroupsUserRepository = {
  readonly getAvailable: typeof ds.getAvailable
  readonly getUserGroupRates: typeof ds.getUserGroupRates
}
