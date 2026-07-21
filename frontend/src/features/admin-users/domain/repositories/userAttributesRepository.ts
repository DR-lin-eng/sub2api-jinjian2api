/**
 * UserAttributesRepository (interface). Auto-generated from userAttributesDatasource.ts.
 */
import type * as ds from '@/features/admin-users/data/datasources/userAttributesDatasource'

export type UserAttributesRepository = {
  readonly listDefinitions: typeof ds.listDefinitions
  readonly listEnabledDefinitions: typeof ds.listEnabledDefinitions
  readonly createDefinition: typeof ds.createDefinition
  readonly updateDefinition: typeof ds.updateDefinition
  readonly deleteDefinition: typeof ds.deleteDefinition
  readonly reorderDefinitions: typeof ds.reorderDefinitions
  readonly getUserAttributeValues: typeof ds.getUserAttributeValues
  readonly updateUserAttributeValues: typeof ds.updateUserAttributeValues
  readonly getBatchUserAttributes: typeof ds.getBatchUserAttributes
}
