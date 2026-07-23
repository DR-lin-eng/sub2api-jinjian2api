import { apiClient } from '@/core/networks/client'
import { BackupS3ConfigDto } from '@/features/admin-backup/data/models/backupS3ConfigDto'
import { BackupScheduleConfigDto } from '@/features/admin-backup/data/models/backupScheduleConfigDto'
import { BackupRecordDto } from '@/features/admin-backup/data/models/backupRecordDto'
import { ImageStorageConfigDto } from '@/features/admin-backup/data/models/imageStorageConfigDto'
import { TestS3ResponseDto } from '@/features/admin-backup/data/models/testS3ResponseDto'
import type { UpdateBackupS3ConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupS3ConfigRequest'
import type { UpdateBackupScheduleConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupScheduleConfigRequest'
import type { UpdateImageStorageConfigRequest } from '@/features/admin-backup/data/requests_models/updateImageStorageConfigRequest'
import type { CreateBackupRequest } from '@/features/admin-backup/data/requests_models/createBackupRequest'

export class AdminBackupActionDatasource {
  async updateS3Config(req: UpdateBackupS3ConfigRequest): Promise<BackupS3ConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/backups/s3-config', req)
    return BackupS3ConfigDto.fromJson(data)
  }

  async testS3Connection(req: UpdateBackupS3ConfigRequest): Promise<TestS3ResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/backups/s3-config/test', req)
    return TestS3ResponseDto.fromJson(data)
  }

  async updateImageStorageConfig(req: UpdateImageStorageConfigRequest): Promise<ImageStorageConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/backups/image-storage', req)
    return ImageStorageConfigDto.fromJson(data)
  }

  async testImageStorageConnection(req: UpdateImageStorageConfigRequest): Promise<TestS3ResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/backups/image-storage/test', req)
    return TestS3ResponseDto.fromJson(data)
  }

  async updateSchedule(req: UpdateBackupScheduleConfigRequest): Promise<BackupScheduleConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/backups/schedule', req)
    return BackupScheduleConfigDto.fromJson(data)
  }

  async createBackup(req?: CreateBackupRequest): Promise<BackupRecordDto> {
    const { data } = await apiClient.post<unknown>('/admin/backups', req ?? {})
    return BackupRecordDto.fromJson(data)
  }

  async deleteBackup(id: string): Promise<void> {
    await apiClient.delete(`/admin/backups/${id}`)
  }

  async restoreBackup(id: string, password: string): Promise<BackupRecordDto> {
    const { data } = await apiClient.post<unknown>(`/admin/backups/${id}/restore`, { password })
    return BackupRecordDto.fromJson(data)
  }
}

export const adminBackupActionDatasource = new AdminBackupActionDatasource()
