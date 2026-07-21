/**
 * ApiKeysRepositoryImpl. Auto-generated from apiKeysDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-usage/data/datasources/apiKeysDatasource'
import type { ApiKeysRepository } from '@/features/admin-usage/domain/repositories/apiKeysRepository'

export class ApiKeysRepositoryImpl implements ApiKeysRepository {
  get updateApiKeyGroup(): typeof ds.updateApiKeyGroup { return ds.updateApiKeyGroup }
}

export const apiKeysRepository: ApiKeysRepository = new ApiKeysRepositoryImpl()
