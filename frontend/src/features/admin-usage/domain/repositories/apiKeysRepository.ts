/**
 * ApiKeysRepository (interface). Auto-generated from apiKeysDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/apiKeysRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-usage/data/datasources/apiKeysDatasource'

export type ApiKeysRepository = {
  updateApiKeyGroup: typeof ds.updateApiKeyGroup
}
