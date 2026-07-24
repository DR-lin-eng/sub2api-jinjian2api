import type { AdminBoundAuthIdentityChannel } from '@/features/admin-users/domain/models/adminBoundAuthIdentityChannel'

export class AdminBoundAuthIdentity {
  userId!: number
  providerType!: string
  providerKey!: string
  providerSubject!: string
  verifiedAt!: string
  issuer!: string
  metadata!: Record<string, unknown>
  createdAt!: string
  updatedAt!: string
  channel?: AdminBoundAuthIdentityChannel
}
