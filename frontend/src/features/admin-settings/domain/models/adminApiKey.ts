import type { AdminApiKeyScope } from '@/features/admin-settings/enums/adminApiKeyScope'

export class AdminApiKey {
  id!: string
  name!: string
  keyPrefix!: string
  lastFour!: string
  scopes!: AdminApiKeyScope[]
  status!: 'active' | 'revoked' | string
  expiresAt?: string | null
  createdBy!: number
  lastUsedAt?: string | null
  createdAt!: string
  updatedAt!: string
  revokedAt?: string | null
}
