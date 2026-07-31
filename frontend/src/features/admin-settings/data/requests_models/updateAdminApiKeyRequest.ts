import type { AdminApiKeyScope } from '@/features/admin-settings/enums/adminApiKeyScope'

export interface UpdateAdminApiKeyRequest {
  name?: string
  scopes?: AdminApiKeyScope[]
  expires_at?: string | null
}
