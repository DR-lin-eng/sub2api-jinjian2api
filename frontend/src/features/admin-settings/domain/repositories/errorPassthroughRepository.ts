/**
 * ErrorPassthroughRepository (interface). Auto-generated from errorPassthroughDatasource.ts.
 */
import type * as ds from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'

export type ErrorPassthroughRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteRule: typeof ds.deleteRule
  readonly toggleEnabled: typeof ds.toggleEnabled
}
