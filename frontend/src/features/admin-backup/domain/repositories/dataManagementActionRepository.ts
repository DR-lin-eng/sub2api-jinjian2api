import type { CreateBackupJobResponse } from '@/features/admin-backup/domain/models/createBackupJobResponse'
import type { DataManagementConfig } from '@/features/admin-backup/domain/models/dataManagementConfig'
import type { DataManagementS3Profile } from '@/features/admin-backup/domain/models/dataManagementS3Profile'
import type { DataManagementSourceProfile } from '@/features/admin-backup/domain/models/dataManagementSourceProfile'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'
import type { TestS3Response } from '@/features/admin-backup/domain/models/testS3Response'
import type { UpdateDataManagementConfigRequest } from '@/features/admin-backup/data/requests_models/updateDataManagementConfigRequest'
import type { TestS3Request } from '@/features/admin-backup/data/requests_models/testS3Request'
import type { CreateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/createSourceProfileRequest'
import type { UpdateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/updateSourceProfileRequest'
import type { CreateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/createS3ProfileRequest'
import type { UpdateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/updateS3ProfileRequest'
import type { CreateBackupJobRequest } from '@/features/admin-backup/data/requests_models/createBackupJobRequest'

export interface DataManagementActionRepository {
  updateConfig(req: UpdateDataManagementConfigRequest): Promise<DataManagementConfig>
  testS3(req: TestS3Request): Promise<TestS3Response>
  createSourceProfile(sourceType: SourceType, req: CreateSourceProfileRequest): Promise<DataManagementSourceProfile>
  updateSourceProfile(sourceType: SourceType, profileId: string, req: UpdateSourceProfileRequest): Promise<DataManagementSourceProfile>
  deleteSourceProfile(sourceType: SourceType, profileId: string): Promise<void>
  setActiveSourceProfile(sourceType: SourceType, profileId: string): Promise<DataManagementSourceProfile>
  createS3Profile(req: CreateS3ProfileRequest): Promise<DataManagementS3Profile>
  updateS3Profile(profileId: string, req: UpdateS3ProfileRequest): Promise<DataManagementS3Profile>
  deleteS3Profile(profileId: string): Promise<void>
  setActiveS3Profile(profileId: string): Promise<DataManagementS3Profile>
  createBackupJob(req: CreateBackupJobRequest): Promise<CreateBackupJobResponse>
}
