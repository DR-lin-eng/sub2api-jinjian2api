import type { UserAttributeDefinition } from '@/features/admin-users/domain/models/userAttributeDefinition'
import type { UserAttributesActionRepository } from '@/features/admin-users/domain/repositories/userAttributesActionRepository'
import type { CreateUserAttributeRequest } from '@/features/admin-users/data/requests_models/createUserAttributeRequest'
import type { UpdateUserAttributeRequest } from '@/features/admin-users/data/requests_models/updateUserAttributeRequest'
import type { ReorderUserAttributesRequest } from '@/features/admin-users/data/requests_models/reorderUserAttributesRequest'
import type { UpdateUserAttributeValuesRequest } from '@/features/admin-users/data/requests_models/updateUserAttributeValuesRequest'
import { userAttributesActionDatasource } from '@/features/admin-users/data/datasources/userAttributesActionDatasource'

export class UserAttributesActionRepositoryImpl implements UserAttributesActionRepository {
  private readonly ds = userAttributesActionDatasource

  createDefinition = async (req: CreateUserAttributeRequest) : Promise<UserAttributeDefinition>  => {
    return (await this.ds.createDefinition(req)).toEntity()
  }

  updateDefinition = async (id: number, req: UpdateUserAttributeRequest) : Promise<UserAttributeDefinition>  => {
    return (await this.ds.updateDefinition(id, req)).toEntity()
  }

  deleteDefinition = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteDefinition(id)
  }

  reorderDefinitions = async (req: ReorderUserAttributesRequest) : Promise<{ message: string }>  => {
    return this.ds.reorderDefinitions(req)
  }

  updateUserAttributeValues = async (userId: number, req: UpdateUserAttributeValuesRequest) : Promise<{ message: string }>  => {
    return this.ds.updateUserAttributeValues(userId, req)
  }
}

export const userAttributesActionRepository: UserAttributesActionRepository = new UserAttributesActionRepositoryImpl()
