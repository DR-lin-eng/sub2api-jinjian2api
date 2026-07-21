/**
 * GrokRepositoryImpl. Auto-generated from grokDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-accounts/data/datasources/grokDatasource'
import type { GrokRepository } from '@/features/admin-accounts/domain/repositories/grokRepository'

export class GrokRepositoryImpl implements GrokRepository {
  getGrokSSOImportTimeout = ds.getGrokSSOImportTimeout
  generateAuthUrl = ds.generateAuthUrl
  exchangeCode = ds.exchangeCode
  refreshGrokToken = ds.refreshGrokToken
  queryQuota = ds.queryQuota
  resetQuota = ds.resetQuota
  createFromSSO = ds.createFromSSO
}

export const grokRepository: GrokRepository = new GrokRepositoryImpl()
