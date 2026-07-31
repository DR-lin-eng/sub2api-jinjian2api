import type { UserAttributeDefinition } from '@/features/admin-users/domain/models/userAttributeDefinition'
import type { UserAttributeValue } from '@/features/admin-users/domain/models/userAttributeValue'
import type { UserAttributesQueryRepository } from '@/features/admin-users/domain/repositories/userAttributesQueryRepository'
import { userAttributesQueryDatasource } from '@/features/admin-users/data/datasources/userAttributesQueryDatasource'

export class UserAttributesQueryRepositoryImpl implements UserAttributesQueryRepository {
  private readonly ds = userAttributesQueryDatasource

  listDefinitions = async () : Promise<UserAttributeDefinition[]>  => {
    return (await this.ds.listDefinitions()).map(dto => dto.toEntity())
  }

  listEnabledDefinitions = async () : Promise<UserAttributeDefinition[]>  => {
    return (await this.ds.listEnabledDefinitions()).map(dto => dto.toEntity())
  }

  getUserAttributeValues = async (userId: number) : Promise<UserAttributeValue[]>  => {
    return (await this.ds.getUserAttributeValues(userId)).map(dto => dto.toEntity())
  }

  getBatchUserAttributes = async (userIds: number[]) : Promise<Record<number, Record<number, string>>>  => {
    return this.ds.getBatchUserAttributes(userIds)
  }
}

export const userAttributesQueryRepository: UserAttributesQueryRepository = new UserAttributesQueryRepositoryImpl()
