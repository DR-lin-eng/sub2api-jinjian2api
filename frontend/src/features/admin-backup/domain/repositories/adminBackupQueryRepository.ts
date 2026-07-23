import type { BackupRecord } from '@/features/admin-backup/domain/models/backupRecord'
import type { BackupS3Config } from '@/features/admin-backup/domain/models/backupS3Config'
import type { BackupScheduleConfig } from '@/features/admin-backup/domain/models/backupScheduleConfig'
import type { ImageStorageConfigResponse } from '@/features/admin-backup/domain/models/imageStorageConfigResponse'

export interface AdminBackupQueryRepository {
  getS3Config(): Promise<BackupS3Config>
  getImageStorageConfig(): Promise<ImageStorageConfigResponse>
  getSchedule(): Promise<BackupScheduleConfig>
  listBackups(): Promise<{ items: BackupRecord[] }>
  getBackup(id: string): Promise<BackupRecord>
  getDownloadURL(id: string): Promise<{ url: string }>
}
