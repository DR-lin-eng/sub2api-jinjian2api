/**
 * AdminBackupRepository (interface). Auto-generated from adminBackupDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminBackupRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-backup/data/datasources/adminBackupDatasource'

export type AdminBackupRepository = {
  getS3Config: typeof ds.getS3Config
  updateS3Config: typeof ds.updateS3Config
  testS3Connection: typeof ds.testS3Connection
  getImageStorageConfig: typeof ds.getImageStorageConfig
  updateImageStorageConfig: typeof ds.updateImageStorageConfig
  testImageStorageConnection: typeof ds.testImageStorageConnection
  getSchedule: typeof ds.getSchedule
  updateSchedule: typeof ds.updateSchedule
  createBackup: typeof ds.createBackup
  listBackups: typeof ds.listBackups
  getBackup: typeof ds.getBackup
  deleteBackup: typeof ds.deleteBackup
  getDownloadURL: typeof ds.getDownloadURL
  restoreBackup: typeof ds.restoreBackup
}
