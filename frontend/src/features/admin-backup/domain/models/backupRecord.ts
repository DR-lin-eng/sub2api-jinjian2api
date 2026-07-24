import type { BackupStatus } from '@/features/admin-backup/enums/backupStatus'

export class BackupRecord {
  id!: string
  status!: BackupStatus
  backupType!: string
  fileName!: string
  s3Key!: string
  sizeBytes!: number
  triggeredBy!: string
  errorMessage!: string
  startedAt!: string
  finishedAt!: string
  expiresAt!: string
  progress!: string
  restoreStatus!: string
  restoreError!: string
  restoredAt!: string
}
