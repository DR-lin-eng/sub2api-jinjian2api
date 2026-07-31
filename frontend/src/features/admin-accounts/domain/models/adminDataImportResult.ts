import { AdminDataImportError } from '@/features/admin-accounts/domain/models/adminDataImportError'

export class AdminDataImportResult {
  proxyCreated!: number
  proxyReused!: number
  proxyFailed!: number
  accountCreated!: number
  accountFailed!: number
  errors!: AdminDataImportError[]
}
