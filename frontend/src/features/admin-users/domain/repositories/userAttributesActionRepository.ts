import type { UserAttributeDefinition } from '@/features/admin-users/domain/models/userAttributeDefinition'
import type { CreateUserAttributeRequest } from '@/features/admin-users/data/requests_models/createUserAttributeRequest'
import type { UpdateUserAttributeRequest } from '@/features/admin-users/data/requests_models/updateUserAttributeRequest'
import type { ReorderUserAttributesRequest } from '@/features/admin-users/data/requests_models/reorderUserAttributesRequest'
import type { UpdateUserAttributeValuesRequest } from '@/features/admin-users/data/requests_models/updateUserAttributeValuesRequest'

export interface UserAttributesActionRepository {
  createDefinition(req: CreateUserAttributeRequest): Promise<UserAttributeDefinition>
  updateDefinition(id: number, req: UpdateUserAttributeRequest): Promise<UserAttributeDefinition>
  deleteDefinition(id: number): Promise<{ message: string }>
  reorderDefinitions(req: ReorderUserAttributesRequest): Promise<{ message: string }>
  updateUserAttributeValues(userId: number, req: UpdateUserAttributeValuesRequest): Promise<{ message: string }>
}
