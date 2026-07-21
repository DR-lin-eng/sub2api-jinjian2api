/**
 * DataManagementRepositoryImpl. Auto-generated from dataManagementDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-backup/data/datasources/dataManagementDatasource'
import type { DataManagementRepository } from '@/features/admin-backup/domain/repositories/dataManagementRepository'

export class DataManagementRepositoryImpl implements DataManagementRepository {
  get getAgentHealth(): typeof ds.getAgentHealth { return ds.getAgentHealth }
  get getConfig(): typeof ds.getConfig { return ds.getConfig }
  get updateConfig(): typeof ds.updateConfig { return ds.updateConfig }
  get testS3(): typeof ds.testS3 { return ds.testS3 }
  get listSourceProfiles(): typeof ds.listSourceProfiles { return ds.listSourceProfiles }
  get createSourceProfile(): typeof ds.createSourceProfile { return ds.createSourceProfile }
  get updateSourceProfile(): typeof ds.updateSourceProfile { return ds.updateSourceProfile }
  get deleteSourceProfile(): typeof ds.deleteSourceProfile { return ds.deleteSourceProfile }
  get setActiveSourceProfile(): typeof ds.setActiveSourceProfile { return ds.setActiveSourceProfile }
  get listS3Profiles(): typeof ds.listS3Profiles { return ds.listS3Profiles }
  get createS3Profile(): typeof ds.createS3Profile { return ds.createS3Profile }
  get updateS3Profile(): typeof ds.updateS3Profile { return ds.updateS3Profile }
  get deleteS3Profile(): typeof ds.deleteS3Profile { return ds.deleteS3Profile }
  get setActiveS3Profile(): typeof ds.setActiveS3Profile { return ds.setActiveS3Profile }
  get createBackupJob(): typeof ds.createBackupJob { return ds.createBackupJob }
  get listBackupJobs(): typeof ds.listBackupJobs { return ds.listBackupJobs }
  get getBackupJob(): typeof ds.getBackupJob { return ds.getBackupJob }
}

export const dataManagementRepository: DataManagementRepository = new DataManagementRepositoryImpl()
