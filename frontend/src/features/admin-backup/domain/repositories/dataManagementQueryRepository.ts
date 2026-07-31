import type { BackupAgentHealth } from '@/features/admin-backup/domain/models/backupAgentHealth'
import type { BackupJob } from '@/features/admin-backup/domain/models/backupJob'
import type { DataManagementConfig } from '@/features/admin-backup/domain/models/dataManagementConfig'
import type { ListBackupJobsResponse } from '@/features/admin-backup/domain/models/listBackupJobsResponse'
import type { ListS3ProfilesResponse } from '@/features/admin-backup/domain/models/listS3ProfilesResponse'
import type { ListSourceProfilesResponse } from '@/features/admin-backup/domain/models/listSourceProfilesResponse'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'
import type { ListBackupJobsRequest } from '@/features/admin-backup/data/requests_models/listBackupJobsRequest'

export interface DataManagementQueryRepository {
  getAgentHealth(): Promise<BackupAgentHealth>
  getConfig(): Promise<DataManagementConfig>
  listSourceProfiles(sourceType: SourceType): Promise<ListSourceProfilesResponse>
  listS3Profiles(): Promise<ListS3ProfilesResponse>
  listBackupJobs(request?: ListBackupJobsRequest): Promise<ListBackupJobsResponse>
  getBackupJob(jobId: string): Promise<BackupJob>
}
