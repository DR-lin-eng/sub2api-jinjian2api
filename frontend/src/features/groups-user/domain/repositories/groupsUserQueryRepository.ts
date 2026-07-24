import type { Group } from '@/features/admin-groups/domain/models/group'

export interface GroupsUserQueryRepository {
  getAvailable(): Promise<Group[]>
  getUserGroupRates(): Promise<Record<number, number>>
}
