/**
 * GrokRepositoryImpl. Auto-generated from grokDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-accounts/data/datasources/grokDatasource'
import type { GrokRepository } from '@/features/admin-accounts/domain/repositories/grokRepository'

export class GrokRepositoryImpl implements GrokRepository {
  get getGrokSSOImportTimeout(): typeof ds.getGrokSSOImportTimeout { return ds.getGrokSSOImportTimeout }
  get generateAuthUrl(): typeof ds.generateAuthUrl { return ds.generateAuthUrl }
  get exchangeCode(): typeof ds.exchangeCode { return ds.exchangeCode }
  get refreshGrokToken(): typeof ds.refreshGrokToken { return ds.refreshGrokToken }
  get queryQuota(): typeof ds.queryQuota { return ds.queryQuota }
  get resetQuota(): typeof ds.resetQuota { return ds.resetQuota }
  get createFromSSO(): typeof ds.createFromSSO { return ds.createFromSSO }
}

export const grokRepository: GrokRepository = new GrokRepositoryImpl()
