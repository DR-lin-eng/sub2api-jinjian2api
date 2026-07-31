import { adminBackupQueryDatasource } from '@/features/admin-backup/data/datasources/adminBackupQueryDatasource'
import type { BackupRecord } from '@/features/admin-backup/domain/models/backupRecord'
import type { BackupS3Config } from '@/features/admin-backup/domain/models/backupS3Config'
import type { BackupScheduleConfig } from '@/features/admin-backup/domain/models/backupScheduleConfig'
import type { ImageStorageConfigResponse } from '@/features/admin-backup/domain/models/imageStorageConfigResponse'
import type { AdminBackupQueryRepository } from '@/features/admin-backup/domain/repositories/adminBackupQueryRepository'

export class AdminBackupQueryRepositoryImpl implements AdminBackupQueryRepository {
  private readonly ds = adminBackupQueryDatasource

  getS3Config = async () : Promise<BackupS3Config>  => {
    return (await this.ds.getS3Config()).toEntity()
  }

  getImageStorageConfig = async () : Promise<ImageStorageConfigResponse>  => {
    return (await this.ds.getImageStorageConfig()).toEntity()
  }

  getSchedule = async () : Promise<BackupScheduleConfig>  => {
    return (await this.ds.getSchedule()).toEntity()
  }

  listBackups = async () : Promise<{ items: BackupRecord[] }>  => {
    const { items } = await this.ds.listBackups()
    return { items: items.map(dto => dto.toEntity()) }
  }

  getBackup = async (id: string) : Promise<BackupRecord>  => {
    return (await this.ds.getBackup(id)).toEntity()
  }

  getDownloadURL = async (id: string) : Promise<{ url: string }>  => {
    return this.ds.getDownloadURL(id)
  }
}

export const adminBackupQueryRepository: AdminBackupQueryRepository = new AdminBackupQueryRepositoryImpl()
