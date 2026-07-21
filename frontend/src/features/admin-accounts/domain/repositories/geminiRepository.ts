/**
 * GeminiRepository (interface). Auto-generated from geminiDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/geminiRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/geminiDatasource'

export type GeminiRepository = {
  generateAuthUrl: typeof ds.generateAuthUrl
  exchangeCode: typeof ds.exchangeCode
  getCapabilities: typeof ds.getCapabilities
}
