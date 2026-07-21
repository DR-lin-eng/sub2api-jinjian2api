/**
 * DataManagementRepository (interface). Auto-generated from dataManagementDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/dataManagementRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-backup/data/datasources/dataManagementDatasource'

export type DataManagementRepository = {
  getAgentHealth: typeof ds.getAgentHealth
  getConfig: typeof ds.getConfig
  updateConfig: typeof ds.updateConfig
  testS3: typeof ds.testS3
  listSourceProfiles: typeof ds.listSourceProfiles
  createSourceProfile: typeof ds.createSourceProfile
  updateSourceProfile: typeof ds.updateSourceProfile
  deleteSourceProfile: typeof ds.deleteSourceProfile
  setActiveSourceProfile: typeof ds.setActiveSourceProfile
  listS3Profiles: typeof ds.listS3Profiles
  createS3Profile: typeof ds.createS3Profile
  updateS3Profile: typeof ds.updateS3Profile
  deleteS3Profile: typeof ds.deleteS3Profile
  setActiveS3Profile: typeof ds.setActiveS3Profile
  createBackupJob: typeof ds.createBackupJob
  listBackupJobs: typeof ds.listBackupJobs
  getBackupJob: typeof ds.getBackupJob
}
