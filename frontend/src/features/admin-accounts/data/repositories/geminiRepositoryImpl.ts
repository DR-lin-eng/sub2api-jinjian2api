/**
 * GeminiRepositoryImpl. Auto-generated from geminiDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-accounts/data/datasources/geminiDatasource'
import type { GeminiRepository } from '@/features/admin-accounts/domain/repositories/geminiRepository'

export class GeminiRepositoryImpl implements GeminiRepository {
  generateAuthUrl = ds.generateAuthUrl
  exchangeCode = ds.exchangeCode
  getCapabilities = ds.getCapabilities
}

export const geminiRepository: GeminiRepository = new GeminiRepositoryImpl()
