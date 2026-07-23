import type { BackupJobStatus } from '@/features/admin-backup/domain/models/backupJobStatus'

export class CreateBackupJobResponse {
  jobId!: string
  status!: BackupJobStatus
}
