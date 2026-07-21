/**
 * UserAttributesRepositoryImpl. Auto-generated from userAttributesDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-users/data/datasources/userAttributesDatasource'
import type { UserAttributesRepository } from '@/features/admin-users/domain/repositories/userAttributesRepository'

export class UserAttributesRepositoryImpl implements UserAttributesRepository {
  get listDefinitions(): typeof ds.listDefinitions { return ds.listDefinitions }
  get listEnabledDefinitions(): typeof ds.listEnabledDefinitions { return ds.listEnabledDefinitions }
  get createDefinition(): typeof ds.createDefinition { return ds.createDefinition }
  get updateDefinition(): typeof ds.updateDefinition { return ds.updateDefinition }
  get deleteDefinition(): typeof ds.deleteDefinition { return ds.deleteDefinition }
  get reorderDefinitions(): typeof ds.reorderDefinitions { return ds.reorderDefinitions }
  get getUserAttributeValues(): typeof ds.getUserAttributeValues { return ds.getUserAttributeValues }
  get updateUserAttributeValues(): typeof ds.updateUserAttributeValues { return ds.updateUserAttributeValues }
  get getBatchUserAttributes(): typeof ds.getBatchUserAttributes { return ds.getBatchUserAttributes }
}

export const userAttributesRepository: UserAttributesRepository = new UserAttributesRepositoryImpl()
