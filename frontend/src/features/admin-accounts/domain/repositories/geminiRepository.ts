/**
 * GeminiRepository (interface). Auto-generated from geminiDatasource.ts.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/geminiDatasource'

export type GeminiRepository = {
  readonly generateAuthUrl: typeof ds.generateAuthUrl
  readonly exchangeCode: typeof ds.exchangeCode
  readonly getCapabilities: typeof ds.getCapabilities
}
