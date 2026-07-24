import { apiClient } from '@/core/networks/client'
import { BackupAgentHealthDto } from '@/features/admin-backup/data/models/backupAgentHealthDto'
import { DataManagementConfigDto } from '@/features/admin-backup/data/models/dataManagementConfigDto'
import { ListSourceProfilesResponseDto } from '@/features/admin-backup/data/models/listSourceProfilesResponseDto'
import { ListS3ProfilesResponseDto } from '@/features/admin-backup/data/models/listS3ProfilesResponseDto'
import { BackupJobDto } from '@/features/admin-backup/data/models/backupJobDto'
import { ListBackupJobsResponseDto } from '@/features/admin-backup/data/models/listBackupJobsResponseDto'
import type { ListBackupJobsRequest } from '@/features/admin-backup/data/requests_models/listBackupJobsRequest'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'

export class DataManagementQueryDatasource {
  async getAgentHealth(): Promise<BackupAgentHealthDto> {
    const { data } = await apiClient.get<unknown>('/admin/data-management/agent/health')
    return BackupAgentHealthDto.fromJson(data)
  }

  async getConfig(): Promise<DataManagementConfigDto> {
    const { data } = await apiClient.get<unknown>('/admin/data-management/config')
    return DataManagementConfigDto.fromJson(data)
  }

  async listSourceProfiles(sourceType: SourceType): Promise<ListSourceProfilesResponseDto> {
    const { data } = await apiClient.get<unknown>(
      `/admin/data-management/sources/${sourceType}/profiles`,
    )
    return ListSourceProfilesResponseDto.fromJson(data)
  }

  async listS3Profiles(): Promise<ListS3ProfilesResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/data-management/s3/profiles')
    return ListS3ProfilesResponseDto.fromJson(data)
  }

  async listBackupJobs(request?: ListBackupJobsRequest): Promise<ListBackupJobsResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/data-management/backups', {
      params: request,
    })
    return ListBackupJobsResponseDto.fromJson(data)
  }

  async getBackupJob(jobId: string): Promise<BackupJobDto> {
    const { data } = await apiClient.get<unknown>(`/admin/data-management/backups/${jobId}`)
    return BackupJobDto.fromJson(data)
  }
}

export const dataManagementQueryDatasource = new DataManagementQueryDatasource()
