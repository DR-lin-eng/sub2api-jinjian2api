/**
 * ApiKeysRepositoryImpl. Auto-generated from apiKeysDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-usage/data/datasources/apiKeysDatasource'
import type { ApiKeysRepository } from '@/features/admin-usage/domain/repositories/apiKeysRepository'

export class ApiKeysRepositoryImpl implements ApiKeysRepository {
  updateApiKeyGroup = ds.updateApiKeyGroup
}

export const apiKeysRepository: ApiKeysRepository = new ApiKeysRepositoryImpl()
