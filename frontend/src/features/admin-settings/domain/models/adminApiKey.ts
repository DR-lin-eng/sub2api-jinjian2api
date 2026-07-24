export type AdminApiKeyScope =
  | 'admin.read' | 'admin.write' | 'admin.users.read' | 'admin.users.write'
  | 'admin.accounts.read' | 'admin.accounts.write' | 'admin.settings.read' | 'admin.settings.write'
  | 'admin.backups.read' | 'admin.backups.write' | 'admin.system.read' | 'admin.system.write'
  | 'admin.audit.read' | 'admin.audit.write' | 'admin.ops.read' | 'admin.ops.write'

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
