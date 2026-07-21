/**
 * AntigravityRepositoryImpl. Auto-generated from antigravityDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-accounts/data/datasources/antigravityDatasource'
import type { AntigravityRepository } from '@/features/admin-accounts/domain/repositories/antigravityRepository'

export class AntigravityRepositoryImpl implements AntigravityRepository {
  get generateAuthUrl(): typeof ds.generateAuthUrl { return ds.generateAuthUrl }
  get exchangeCode(): typeof ds.exchangeCode { return ds.exchangeCode }
  get refreshAntigravityToken(): typeof ds.refreshAntigravityToken { return ds.refreshAntigravityToken }
}

export const antigravityRepository: AntigravityRepository = new AntigravityRepositoryImpl()
