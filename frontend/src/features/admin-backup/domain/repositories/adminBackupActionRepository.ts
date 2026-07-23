import type { BackupRecord } from '@/features/admin-backup/domain/models/backupRecord'
import type { BackupS3Config } from '@/features/admin-backup/domain/models/backupS3Config'
import type { BackupScheduleConfig } from '@/features/admin-backup/domain/models/backupScheduleConfig'
import type { ImageStorageConfig } from '@/features/admin-backup/domain/models/imageStorageConfig'
import type { TestS3Response } from '@/features/admin-backup/domain/models/testS3Response'
import type { UpdateBackupS3ConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupS3ConfigRequest'
import type { UpdateBackupScheduleConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupScheduleConfigRequest'
import type { UpdateImageStorageConfigRequest } from '@/features/admin-backup/data/requests_models/updateImageStorageConfigRequest'
import type { CreateBackupRequest } from '@/features/admin-backup/data/requests_models/createBackupRequest'

export interface AdminBackupActionRepository {
  updateS3Config(req: UpdateBackupS3ConfigRequest): Promise<BackupS3Config>
  testS3Connection(req: UpdateBackupS3ConfigRequest): Promise<TestS3Response>
  updateImageStorageConfig(req: UpdateImageStorageConfigRequest): Promise<ImageStorageConfig>
  testImageStorageConnection(req: UpdateImageStorageConfigRequest): Promise<TestS3Response>
  updateSchedule(req: UpdateBackupScheduleConfigRequest): Promise<BackupScheduleConfig>
  createBackup(req?: CreateBackupRequest): Promise<BackupRecord>
  deleteBackup(id: string): Promise<void>
  restoreBackup(id: string, password: string): Promise<BackupRecord>
}
