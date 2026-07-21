/**
 * TlsFingerprintProfileRepositoryImpl. Auto-generated from tlsFingerprintProfileDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'
import type { TlsFingerprintProfileRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileRepository'

export class TlsFingerprintProfileRepositoryImpl implements TlsFingerprintProfileRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteProfile = ds.deleteProfile
}

export const tlsFingerprintProfileRepository: TlsFingerprintProfileRepository = new TlsFingerprintProfileRepositoryImpl()
