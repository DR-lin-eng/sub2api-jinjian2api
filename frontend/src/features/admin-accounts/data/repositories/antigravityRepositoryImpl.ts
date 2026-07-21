/**
 * AntigravityRepositoryImpl. Auto-generated from antigravityDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-accounts/data/datasources/antigravityDatasource'
import type { AntigravityRepository } from '@/features/admin-accounts/domain/repositories/antigravityRepository'

export class AntigravityRepositoryImpl implements AntigravityRepository {
  generateAuthUrl = ds.generateAuthUrl
  exchangeCode = ds.exchangeCode
  refreshAntigravityToken = ds.refreshAntigravityToken
}

export const antigravityRepository: AntigravityRepository = new AntigravityRepositoryImpl()
