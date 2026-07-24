import type { BackupJobStatus } from '@/features/admin-backup/enums/backupJobStatus'

export class CreateBackupJobResponse {
  jobId!: string
  status!: BackupJobStatus
}
