import { groupsUserQueryDatasource } from '@/features/groups-user/data/datasources/groupsUserQueryDatasource'
import type { Group } from '@/features/admin-groups/domain/models/group'
import type { GroupsUserQueryRepository } from '@/features/groups-user/domain/repositories/groupsUserQueryRepository'

export class GroupsUserQueryRepositoryImpl implements GroupsUserQueryRepository {
  private readonly ds = groupsUserQueryDatasource

  async getAvailable(): Promise<Group[]> {
    return (await this.ds.getAvailable()).map(dto => dto.toEntity())
  }

  async getUserGroupRates(): Promise<Record<number, number>> {
    return this.ds.getUserGroupRates()
  }
}

export const groupsUserQueryRepository: GroupsUserQueryRepository = new GroupsUserQueryRepositoryImpl()

export const userGroupsAPI = {
  getAvailable: () => groupsUserQueryRepository.getAvailable(),
  getUserGroupRates: () => groupsUserQueryRepository.getUserGroupRates(),
}
