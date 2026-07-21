/**
 * AntigravityRepository (interface). Auto-generated from antigravityDatasource.ts.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/antigravityDatasource'

export type AntigravityRepository = {
  readonly generateAuthUrl: typeof ds.generateAuthUrl
  readonly exchangeCode: typeof ds.exchangeCode
  readonly refreshAntigravityToken: typeof ds.refreshAntigravityToken
}
