/**
 * AdminBackupRepositoryImpl. Auto-generated from adminBackupDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-backup/data/datasources/adminBackupDatasource'
import type { AdminBackupRepository } from '@/features/admin-backup/domain/repositories/adminBackupRepository'

export class AdminBackupRepositoryImpl implements AdminBackupRepository {
  getS3Config = ds.getS3Config
  updateS3Config = ds.updateS3Config
  testS3Connection = ds.testS3Connection
  getImageStorageConfig = ds.getImageStorageConfig
  updateImageStorageConfig = ds.updateImageStorageConfig
  testImageStorageConnection = ds.testImageStorageConnection
  getSchedule = ds.getSchedule
  updateSchedule = ds.updateSchedule
  createBackup = ds.createBackup
  listBackups = ds.listBackups
  getBackup = ds.getBackup
  deleteBackup = ds.deleteBackup
  getDownloadURL = ds.getDownloadURL
  restoreBackup = ds.restoreBackup
}

export const adminBackupRepository: AdminBackupRepository = new AdminBackupRepositoryImpl()
