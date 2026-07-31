import type { Group } from '@/core/models/domain/group'

export interface GroupsUserQueryRepository {
  getAvailable(): Promise<Group[]>
  getUserGroupRates(): Promise<Record<number, number>>
}
