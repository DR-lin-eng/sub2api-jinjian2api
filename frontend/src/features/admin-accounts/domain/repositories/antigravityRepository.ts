/**
 * AntigravityRepository (interface). Auto-generated from antigravityDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/antigravityRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/antigravityDatasource'

export type AntigravityRepository = {
  generateAuthUrl: typeof ds.generateAuthUrl
  exchangeCode: typeof ds.exchangeCode
  refreshAntigravityToken: typeof ds.refreshAntigravityToken
}
