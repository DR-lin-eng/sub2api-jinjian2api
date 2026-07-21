/**
 * KeysRepositoryImpl. Auto-generated from keysDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/keys/data/datasources/keysDatasource'
import type { KeysRepository } from '@/features/keys/domain/repositories/keysRepository'

export class KeysRepositoryImpl implements KeysRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteKey = ds.deleteKey
  toggleStatus = ds.toggleStatus
}

export const keysRepository: KeysRepository = new KeysRepositoryImpl()
