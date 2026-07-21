/**
 * TlsFingerprintProfileRepository (interface). Auto-generated from tlsFingerprintProfileDatasource.ts.
 */
import type * as ds from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'

export type TlsFingerprintProfileRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteProfile: typeof ds.deleteProfile
}
