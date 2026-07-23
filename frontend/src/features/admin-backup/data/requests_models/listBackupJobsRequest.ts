import type { BackupJobStatus } from '@/features/admin-backup/domain/models/backupJobStatus'
import type { BackupType } from '@/features/admin-backup/domain/models/backupType'

export interface ListBackupJobsRequest {
  page_size?: number
  page_token?: string
  status?: BackupJobStatus
  backup_type?: BackupType
}
