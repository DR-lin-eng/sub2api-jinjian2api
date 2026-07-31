import { adminBackupActionDatasource } from '@/features/admin-backup/data/datasources/adminBackupActionDatasource'
import type { BackupRecord } from '@/features/admin-backup/domain/models/backupRecord'
import type { BackupS3Config } from '@/features/admin-backup/domain/models/backupS3Config'
import type { BackupScheduleConfig } from '@/features/admin-backup/domain/models/backupScheduleConfig'
import type { ImageStorageConfig } from '@/features/admin-backup/domain/models/imageStorageConfig'
import type { TestS3Response } from '@/features/admin-backup/domain/models/testS3Response'
import type { AdminBackupActionRepository } from '@/features/admin-backup/domain/repositories/adminBackupActionRepository'
import type { UpdateBackupS3ConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupS3ConfigRequest'
import type { UpdateBackupScheduleConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupScheduleConfigRequest'
import type { UpdateImageStorageConfigRequest } from '@/features/admin-backup/data/requests_models/updateImageStorageConfigRequest'
import type { CreateBackupRequest } from '@/features/admin-backup/data/requests_models/createBackupRequest'

export class AdminBackupActionRepositoryImpl implements AdminBackupActionRepository {
  private readonly ds = adminBackupActionDatasource

  updateS3Config = async (req: UpdateBackupS3ConfigRequest) : Promise<BackupS3Config>  => {
    return (await this.ds.updateS3Config(req)).toEntity()
  }

  testS3Connection = async (req: UpdateBackupS3ConfigRequest) : Promise<TestS3Response>  => {
    return (await this.ds.testS3Connection(req)).toEntity()
  }

  updateImageStorageConfig = async (req: UpdateImageStorageConfigRequest) : Promise<ImageStorageConfig>  => {
    return (await this.ds.updateImageStorageConfig(req)).toEntity()
  }

  testImageStorageConnection = async (req: UpdateImageStorageConfigRequest) : Promise<TestS3Response>  => {
    return (await this.ds.testImageStorageConnection(req)).toEntity()
  }

  updateSchedule = async (req: UpdateBackupScheduleConfigRequest) : Promise<BackupScheduleConfig>  => {
    return (await this.ds.updateSchedule(req)).toEntity()
  }

  createBackup = async (req?: CreateBackupRequest) : Promise<BackupRecord>  => {
    return (await this.ds.createBackup(req)).toEntity()
  }

  deleteBackup = async (id: string) : Promise<void>  => {
    await this.ds.deleteBackup(id)
  }

  restoreBackup = async (id: string, password: string) : Promise<BackupRecord>  => {
    return (await this.ds.restoreBackup(id, password)).toEntity()
  }
}

export const adminBackupActionRepository: AdminBackupActionRepository = new AdminBackupActionRepositoryImpl()
