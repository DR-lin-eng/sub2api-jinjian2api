/**
 * GeminiRepositoryImpl. Auto-generated from geminiDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-accounts/data/datasources/geminiDatasource'
import type { GeminiRepository } from '@/features/admin-accounts/domain/repositories/geminiRepository'

export class GeminiRepositoryImpl implements GeminiRepository {
  get generateAuthUrl(): typeof ds.generateAuthUrl { return ds.generateAuthUrl }
  get exchangeCode(): typeof ds.exchangeCode { return ds.exchangeCode }
  get getCapabilities(): typeof ds.getCapabilities { return ds.getCapabilities }
}

export const geminiRepository: GeminiRepository = new GeminiRepositoryImpl()
