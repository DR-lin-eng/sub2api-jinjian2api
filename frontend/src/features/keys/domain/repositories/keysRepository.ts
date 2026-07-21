/**
 * KeysRepository (interface). Auto-generated from keysDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/keysRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/keys/data/datasources/keysDatasource'

export type KeysRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteKey: typeof ds.deleteKey
  toggleStatus: typeof ds.toggleStatus
}
