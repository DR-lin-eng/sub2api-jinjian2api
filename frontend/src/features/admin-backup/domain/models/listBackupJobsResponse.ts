import type { BackupJob } from '@/features/admin-backup/domain/models/backupJob'

export class ListBackupJobsResponse {
  items!: BackupJob[]
  nextPageToken!: string
}
