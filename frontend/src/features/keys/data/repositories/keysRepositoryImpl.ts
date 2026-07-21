/**
 * KeysRepositoryImpl. Auto-generated from keysDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/keys/data/datasources/keysDatasource'
import type { KeysRepository } from '@/features/keys/domain/repositories/keysRepository'

export class KeysRepositoryImpl implements KeysRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteKey(): typeof ds.deleteKey { return ds.deleteKey }
  get toggleStatus(): typeof ds.toggleStatus { return ds.toggleStatus }
}

export const keysRepository: KeysRepository = new KeysRepositoryImpl()
