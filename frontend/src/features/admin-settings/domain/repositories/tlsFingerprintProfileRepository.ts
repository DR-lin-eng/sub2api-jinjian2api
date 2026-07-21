/**
 * TlsFingerprintProfileRepository (interface). Auto-generated from tlsFingerprintProfileDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/tlsFingerprintProfileRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'

export type TlsFingerprintProfileRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteProfile: typeof ds.deleteProfile
}
