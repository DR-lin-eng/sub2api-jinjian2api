/**
 * GrokRepository (interface). Auto-generated from grokDatasource.ts.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/grokDatasource'

export type GrokRepository = {
  readonly getGrokSSOImportTimeout: typeof ds.getGrokSSOImportTimeout
  readonly generateAuthUrl: typeof ds.generateAuthUrl
  readonly exchangeCode: typeof ds.exchangeCode
  readonly refreshGrokToken: typeof ds.refreshGrokToken
  readonly queryQuota: typeof ds.queryQuota
  readonly resetQuota: typeof ds.resetQuota
  readonly createFromSSO: typeof ds.createFromSSO
}
