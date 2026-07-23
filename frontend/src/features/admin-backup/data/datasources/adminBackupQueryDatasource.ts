import { apiClient } from '@/core/networks/client'
import { BackupS3ConfigDto } from '@/features/admin-backup/data/models/backupS3ConfigDto'
import { BackupScheduleConfigDto } from '@/features/admin-backup/data/models/backupScheduleConfigDto'
import { BackupRecordDto } from '@/features/admin-backup/data/models/backupRecordDto'
import { ImageStorageConfigResponseDto } from '@/features/admin-backup/data/models/imageStorageConfigResponseDto'

export class AdminBackupQueryDatasource {
  async getS3Config(): Promise<BackupS3ConfigDto> {
    const { data } = await apiClient.get<unknown>('/admin/backups/s3-config')
    return BackupS3ConfigDto.fromJson(data)
  }

  async getImageStorageConfig(): Promise<ImageStorageConfigResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/backups/image-storage')
    return ImageStorageConfigResponseDto.fromJson(data)
  }

  async getSchedule(): Promise<BackupScheduleConfigDto> {
    const { data } = await apiClient.get<unknown>('/admin/backups/schedule')
    return BackupScheduleConfigDto.fromJson(data)
  }

  async listBackups(): Promise<{ items: BackupRecordDto[] }> {
    const { data } = await apiClient.get<{ items: unknown[] }>('/admin/backups')
    return { items: (data.items ?? []).map(item => BackupRecordDto.fromJson(item)) }
  }

  async getBackup(id: string): Promise<BackupRecordDto> {
    const { data } = await apiClient.get<unknown>(`/admin/backups/${id}`)
    return BackupRecordDto.fromJson(data)
  }

  async getDownloadURL(id: string): Promise<{ url: string }> {
    const { data } = await apiClient.get<{ url: string }>(`/admin/backups/${id}/download-url`)
    return data
  }
}

export const adminBackupQueryDatasource = new AdminBackupQueryDatasource()
