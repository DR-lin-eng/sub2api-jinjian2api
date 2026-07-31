import { dataManagementQueryDatasource } from '@/features/admin-backup/data/datasources/dataManagementQueryDatasource'
import type { BackupAgentHealth } from '@/features/admin-backup/domain/models/backupAgentHealth'
import type { BackupJob } from '@/features/admin-backup/domain/models/backupJob'
import type { DataManagementConfig } from '@/features/admin-backup/domain/models/dataManagementConfig'
import type { ListBackupJobsResponse } from '@/features/admin-backup/domain/models/listBackupJobsResponse'
import type { ListS3ProfilesResponse } from '@/features/admin-backup/domain/models/listS3ProfilesResponse'
import type { ListSourceProfilesResponse } from '@/features/admin-backup/domain/models/listSourceProfilesResponse'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'
import type { DataManagementQueryRepository } from '@/features/admin-backup/domain/repositories/dataManagementQueryRepository'
import type { ListBackupJobsRequest } from '@/features/admin-backup/data/requests_models/listBackupJobsRequest'

export class DataManagementQueryRepositoryImpl implements DataManagementQueryRepository {
  private readonly ds = dataManagementQueryDatasource

  getAgentHealth = async () : Promise<BackupAgentHealth>  => {
    return (await this.ds.getAgentHealth()).toEntity()
  }

  getConfig = async () : Promise<DataManagementConfig>  => {
    return (await this.ds.getConfig()).toEntity()
  }

  listSourceProfiles = async (sourceType: SourceType) : Promise<ListSourceProfilesResponse>  => {
    return (await this.ds.listSourceProfiles(sourceType)).toEntity()
  }

  listS3Profiles = async () : Promise<ListS3ProfilesResponse>  => {
    return (await this.ds.listS3Profiles()).toEntity()
  }

  listBackupJobs = async (request?: ListBackupJobsRequest) : Promise<ListBackupJobsResponse>  => {
    return (await this.ds.listBackupJobs(request)).toEntity()
  }

  getBackupJob = async (jobId: string) : Promise<BackupJob>  => {
    return (await this.ds.getBackupJob(jobId)).toEntity()
  }
}

export const dataManagementQueryRepository: DataManagementQueryRepository = new DataManagementQueryRepositoryImpl()
