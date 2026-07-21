/**
 * DataManagementRepositoryImpl. Auto-generated from dataManagementDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-backup/data/datasources/dataManagementDatasource'
import type { DataManagementRepository } from '@/features/admin-backup/domain/repositories/dataManagementRepository'

export class DataManagementRepositoryImpl implements DataManagementRepository {
  getAgentHealth = ds.getAgentHealth
  getConfig = ds.getConfig
  updateConfig = ds.updateConfig
  testS3 = ds.testS3
  listSourceProfiles = ds.listSourceProfiles
  createSourceProfile = ds.createSourceProfile
  updateSourceProfile = ds.updateSourceProfile
  deleteSourceProfile = ds.deleteSourceProfile
  setActiveSourceProfile = ds.setActiveSourceProfile
  listS3Profiles = ds.listS3Profiles
  createS3Profile = ds.createS3Profile
  updateS3Profile = ds.updateS3Profile
  deleteS3Profile = ds.deleteS3Profile
  setActiveS3Profile = ds.setActiveS3Profile
  createBackupJob = ds.createBackupJob
  listBackupJobs = ds.listBackupJobs
  getBackupJob = ds.getBackupJob
}

export const dataManagementRepository: DataManagementRepository = new DataManagementRepositoryImpl()
