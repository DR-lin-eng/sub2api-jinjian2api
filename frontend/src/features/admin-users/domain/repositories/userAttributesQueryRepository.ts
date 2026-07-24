import type { UserAttributeDefinition } from '@/features/admin-users/domain/models/userAttributeDefinition'
import type { UserAttributeValue } from '@/features/admin-users/domain/models/userAttributeValue'

export interface UserAttributesQueryRepository {
  listDefinitions(): Promise<UserAttributeDefinition[]>
  listEnabledDefinitions(): Promise<UserAttributeDefinition[]>
  getUserAttributeValues(userId: number): Promise<UserAttributeValue[]>
  getBatchUserAttributes(userIds: number[]): Promise<Record<number, Record<number, string>>>
}
