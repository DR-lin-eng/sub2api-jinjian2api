/**
 * UserAttributesRepository (interface). Auto-generated from userAttributesDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/userAttributesRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-users/data/datasources/userAttributesDatasource'

export type UserAttributesRepository = {
  listDefinitions: typeof ds.listDefinitions
  listEnabledDefinitions: typeof ds.listEnabledDefinitions
  createDefinition: typeof ds.createDefinition
  updateDefinition: typeof ds.updateDefinition
  deleteDefinition: typeof ds.deleteDefinition
  reorderDefinitions: typeof ds.reorderDefinitions
  getUserAttributeValues: typeof ds.getUserAttributeValues
  updateUserAttributeValues: typeof ds.updateUserAttributeValues
  getBatchUserAttributes: typeof ds.getBatchUserAttributes
}
