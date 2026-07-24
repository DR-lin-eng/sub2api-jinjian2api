import { apiClient } from '@/core/networks/client'
import { GroupDto } from '@/features/admin-groups/data/models/groupDto'

export class GroupsUserQueryDatasource {
  async getAvailable(): Promise<GroupDto[]> {
    const { data } = await apiClient.get<unknown[]>('/groups/available')
    return (data ?? []).map(item => GroupDto.fromJson(item))
  }

  async getUserGroupRates(): Promise<Record<number, number>> {
    const { data } = await apiClient.get<Record<number, number> | null>('/groups/rates')
    return data ?? {}
  }
}

export const groupsUserQueryDatasource = new GroupsUserQueryDatasource()
