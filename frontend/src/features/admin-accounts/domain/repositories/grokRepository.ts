/**
 * GrokRepository (interface). Auto-generated from grokDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/grokRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/grokDatasource'

export type GrokRepository = {
  getGrokSSOImportTimeout: typeof ds.getGrokSSOImportTimeout
  generateAuthUrl: typeof ds.generateAuthUrl
  exchangeCode: typeof ds.exchangeCode
  refreshGrokToken: typeof ds.refreshGrokToken
  queryQuota: typeof ds.queryQuota
  resetQuota: typeof ds.resetQuota
  createFromSSO: typeof ds.createFromSSO
}
