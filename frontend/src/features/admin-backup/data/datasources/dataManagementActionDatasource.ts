import { apiClient } from '@/core/networks/client'
import { DataManagementConfigDto } from '@/features/admin-backup/data/models/dataManagementConfigDto'
import { TestS3ResponseDto } from '@/features/admin-backup/data/models/testS3ResponseDto'
import { DataManagementSourceProfileDto } from '@/features/admin-backup/data/models/dataManagementSourceProfileDto'
import { DataManagementS3ProfileDto } from '@/features/admin-backup/data/models/dataManagementS3ProfileDto'
import { CreateBackupJobResponseDto } from '@/features/admin-backup/data/models/createBackupJobResponseDto'
import type { UpdateDataManagementConfigRequest } from '@/features/admin-backup/data/requests_models/updateDataManagementConfigRequest'
import type { TestS3Request } from '@/features/admin-backup/data/requests_models/testS3Request'
import type { CreateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/createSourceProfileRequest'
import type { UpdateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/updateSourceProfileRequest'
import type { CreateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/createS3ProfileRequest'
import type { UpdateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/updateS3ProfileRequest'
import type { CreateBackupJobRequest } from '@/features/admin-backup/data/requests_models/createBackupJobRequest'
import type { SourceType } from '@/features/admin-backup/domain/models/sourceType'

export class DataManagementActionDatasource {
  async updateConfig(req: UpdateDataManagementConfigRequest): Promise<DataManagementConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/data-management/config', req)
    return DataManagementConfigDto.fromJson(data)
  }

  async testS3(req: TestS3Request): Promise<TestS3ResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/data-management/s3/test', req)
    return TestS3ResponseDto.fromJson(data)
  }

  async createSourceProfile(
    sourceType: SourceType,
    req: CreateSourceProfileRequest,
  ): Promise<DataManagementSourceProfileDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/data-management/sources/${sourceType}/profiles`,
      req,
    )
    return DataManagementSourceProfileDto.fromJson(data)
  }

  async updateSourceProfile(
    sourceType: SourceType,
    profileId: string,
    req: UpdateSourceProfileRequest,
  ): Promise<DataManagementSourceProfileDto> {
    const { data } = await apiClient.put<unknown>(
      `/admin/data-management/sources/${sourceType}/profiles/${profileId}`,
      req,
    )
    return DataManagementSourceProfileDto.fromJson(data)
  }

  async deleteSourceProfile(sourceType: SourceType, profileId: string): Promise<void> {
    await apiClient.delete(`/admin/data-management/sources/${sourceType}/profiles/${profileId}`)
  }

  async setActiveSourceProfile(
    sourceType: SourceType,
    profileId: string,
  ): Promise<DataManagementSourceProfileDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/data-management/sources/${sourceType}/profiles/${profileId}/activate`,
    )
    return DataManagementSourceProfileDto.fromJson(data)
  }

  async createS3Profile(req: CreateS3ProfileRequest): Promise<DataManagementS3ProfileDto> {
    const { data } = await apiClient.post<unknown>('/admin/data-management/s3/profiles', req)
    return DataManagementS3ProfileDto.fromJson(data)
  }

  async updateS3Profile(
    profileId: string,
    req: UpdateS3ProfileRequest,
  ): Promise<DataManagementS3ProfileDto> {
    const { data } = await apiClient.put<unknown>(
      `/admin/data-management/s3/profiles/${profileId}`,
      req,
    )
    return DataManagementS3ProfileDto.fromJson(data)
  }

  async deleteS3Profile(profileId: string): Promise<void> {
    await apiClient.delete(`/admin/data-management/s3/profiles/${profileId}`)
  }

  async setActiveS3Profile(profileId: string): Promise<DataManagementS3ProfileDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/data-management/s3/profiles/${profileId}/activate`,
    )
    return DataManagementS3ProfileDto.fromJson(data)
  }

  async createBackupJob(req: CreateBackupJobRequest): Promise<CreateBackupJobResponseDto> {
    const headers = req.idempotency_key
      ? { 'X-Idempotency-Key': req.idempotency_key }
      : undefined
    const { data } = await apiClient.post<unknown>('/admin/data-management/backups', req, { headers })
    return CreateBackupJobResponseDto.fromJson(data)
  }
}

export const dataManagementActionDatasource = new DataManagementActionDatasource()
