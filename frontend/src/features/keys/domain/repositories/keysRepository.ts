/**
 * KeysRepository (interface). Auto-generated from keysDatasource.ts.
 */
import type * as ds from '@/features/keys/data/datasources/keysDatasource'

export type KeysRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteKey: typeof ds.deleteKey
  readonly toggleStatus: typeof ds.toggleStatus
}
