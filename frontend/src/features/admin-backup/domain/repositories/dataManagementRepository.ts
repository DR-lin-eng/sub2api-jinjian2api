/**
 * DataManagementRepository (interface). Auto-generated from dataManagementDatasource.ts.
 */
import type * as ds from '@/features/admin-backup/data/datasources/dataManagementDatasource'

export type DataManagementRepository = {
  readonly getAgentHealth: typeof ds.getAgentHealth
  readonly getConfig: typeof ds.getConfig
  readonly updateConfig: typeof ds.updateConfig
  readonly testS3: typeof ds.testS3
  readonly listSourceProfiles: typeof ds.listSourceProfiles
  readonly createSourceProfile: typeof ds.createSourceProfile
  readonly updateSourceProfile: typeof ds.updateSourceProfile
  readonly deleteSourceProfile: typeof ds.deleteSourceProfile
  readonly setActiveSourceProfile: typeof ds.setActiveSourceProfile
  readonly listS3Profiles: typeof ds.listS3Profiles
  readonly createS3Profile: typeof ds.createS3Profile
  readonly updateS3Profile: typeof ds.updateS3Profile
  readonly deleteS3Profile: typeof ds.deleteS3Profile
  readonly setActiveS3Profile: typeof ds.setActiveS3Profile
  readonly createBackupJob: typeof ds.createBackupJob
  readonly listBackupJobs: typeof ds.listBackupJobs
  readonly getBackupJob: typeof ds.getBackupJob
}
