import { dataManagementActionDatasource } from '@/features/admin-backup/data/datasources/dataManagementActionDatasource'
import type { DataManagementConfig } from '@/features/admin-backup/domain/models/dataManagementConfig'
import type { DataManagementS3Profile } from '@/features/admin-backup/domain/models/dataManagementS3Profile'
import type { DataManagementSourceProfile } from '@/features/admin-backup/domain/models/dataManagementSourceProfile'
import type { CreateBackupJobResponse } from '@/features/admin-backup/domain/models/createBackupJobResponse'
import type { TestS3Response } from '@/features/admin-backup/domain/models/testS3Response'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'
import type { DataManagementActionRepository } from '@/features/admin-backup/domain/repositories/dataManagementActionRepository'
import type { UpdateDataManagementConfigRequest } from '@/features/admin-backup/data/requests_models/updateDataManagementConfigRequest'
import type { TestS3Request } from '@/features/admin-backup/data/requests_models/testS3Request'
import type { CreateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/createSourceProfileRequest'
import type { UpdateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/updateSourceProfileRequest'
import type { CreateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/createS3ProfileRequest'
import type { UpdateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/updateS3ProfileRequest'
import type { CreateBackupJobRequest } from '@/features/admin-backup/data/requests_models/createBackupJobRequest'

export class DataManagementActionRepositoryImpl implements DataManagementActionRepository {
  private readonly ds = dataManagementActionDatasource

  updateConfig = async (req: UpdateDataManagementConfigRequest) : Promise<DataManagementConfig>  => {
    return (await this.ds.updateConfig(req)).toEntity()
  }

  testS3 = async (req: TestS3Request) : Promise<TestS3Response>  => {
    return (await this.ds.testS3(req)).toEntity()
  }

  createSourceProfile = async (
    sourceType: SourceType,
    req: CreateSourceProfileRequest,
  ): Promise<DataManagementSourceProfile> => {
    return (await this.ds.createSourceProfile(sourceType, req)).toEntity()
  }

  updateSourceProfile = async (
    sourceType: SourceType,
    profileId: string,
    req: UpdateSourceProfileRequest,
  ): Promise<DataManagementSourceProfile> => {
    return (await this.ds.updateSourceProfile(sourceType, profileId, req)).toEntity()
  }

  deleteSourceProfile = async (sourceType: SourceType, profileId: string) : Promise<void>  => {
    await this.ds.deleteSourceProfile(sourceType, profileId)
  }

  setActiveSourceProfile = async (
    sourceType: SourceType,
    profileId: string,
  ): Promise<DataManagementSourceProfile> => {
    return (await this.ds.setActiveSourceProfile(sourceType, profileId)).toEntity()
  }

  createS3Profile = async (req: CreateS3ProfileRequest) : Promise<DataManagementS3Profile>  => {
    return (await this.ds.createS3Profile(req)).toEntity()
  }

  updateS3Profile = async (
    profileId: string,
    req: UpdateS3ProfileRequest,
  ): Promise<DataManagementS3Profile> => {
    return (await this.ds.updateS3Profile(profileId, req)).toEntity()
  }

  deleteS3Profile = async (profileId: string) : Promise<void>  => {
    await this.ds.deleteS3Profile(profileId)
  }

  setActiveS3Profile = async (profileId: string) : Promise<DataManagementS3Profile>  => {
    return (await this.ds.setActiveS3Profile(profileId)).toEntity()
  }

  createBackupJob = async (req: CreateBackupJobRequest) : Promise<CreateBackupJobResponse>  => {
    return (await this.ds.createBackupJob(req)).toEntity()
  }
}

export const dataManagementActionRepository: DataManagementActionRepository = new DataManagementActionRepositoryImpl()
