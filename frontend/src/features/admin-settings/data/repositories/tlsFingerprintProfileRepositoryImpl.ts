/**
 * TlsFingerprintProfileRepositoryImpl. Auto-generated from tlsFingerprintProfileDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'
import type { TlsFingerprintProfileRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileRepository'

export class TlsFingerprintProfileRepositoryImpl implements TlsFingerprintProfileRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteProfile(): typeof ds.deleteProfile { return ds.deleteProfile }
}

export const tlsFingerprintProfileRepository: TlsFingerprintProfileRepository = new TlsFingerprintProfileRepositoryImpl()
