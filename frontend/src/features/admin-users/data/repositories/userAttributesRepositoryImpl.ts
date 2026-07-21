/**
 * UserAttributesRepositoryImpl. Auto-generated from userAttributesDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-users/data/datasources/userAttributesDatasource'
import type { UserAttributesRepository } from '@/features/admin-users/domain/repositories/userAttributesRepository'

export class UserAttributesRepositoryImpl implements UserAttributesRepository {
  listDefinitions = ds.listDefinitions
  listEnabledDefinitions = ds.listEnabledDefinitions
  createDefinition = ds.createDefinition
  updateDefinition = ds.updateDefinition
  deleteDefinition = ds.deleteDefinition
  reorderDefinitions = ds.reorderDefinitions
  getUserAttributeValues = ds.getUserAttributeValues
  updateUserAttributeValues = ds.updateUserAttributeValues
  getBatchUserAttributes = ds.getBatchUserAttributes
}

export const userAttributesRepository: UserAttributesRepository = new UserAttributesRepositoryImpl()
