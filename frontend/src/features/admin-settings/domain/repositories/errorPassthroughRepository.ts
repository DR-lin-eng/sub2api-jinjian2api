/**
 * ErrorPassthroughRepository (interface). Auto-generated from errorPassthroughDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/errorPassthroughRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'

export type ErrorPassthroughRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteRule: typeof ds.deleteRule
  toggleEnabled: typeof ds.toggleEnabled
}
