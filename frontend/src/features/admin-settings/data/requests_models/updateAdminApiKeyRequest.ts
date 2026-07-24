import type { AdminApiKeyScope } from '@/features/admin-settings/domain/models/adminApiKey'

export interface UpdateAdminApiKeyRequest {
  name?: string
  scopes?: AdminApiKeyScope[]
  expires_at?: string | null
}
