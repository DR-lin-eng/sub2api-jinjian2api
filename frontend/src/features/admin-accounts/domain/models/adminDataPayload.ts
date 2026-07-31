import { AdminDataProxy } from '@/features/admin-accounts/domain/models/adminDataProxy'
import { AdminDataAccount } from '@/features/admin-accounts/domain/models/adminDataAccount'

export class AdminDataPayload {
  type!: string
  version!: number
  exportedAt!: string
  proxies!: AdminDataProxy[]
  accounts!: AdminDataAccount[]
  skippedShadows!: number
}

export { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'
export { AdminDataImportError } from '@/features/admin-accounts/domain/models/adminDataImportError'
