/**
 * AdminBackupRepository (interface). Auto-generated from adminBackupDatasource.ts.
 */
import type * as ds from '@/features/admin-backup/data/datasources/adminBackupDatasource'

export type AdminBackupRepository = {
  readonly getS3Config: typeof ds.getS3Config
  readonly updateS3Config: typeof ds.updateS3Config
  readonly testS3Connection: typeof ds.testS3Connection
  readonly getImageStorageConfig: typeof ds.getImageStorageConfig
  readonly updateImageStorageConfig: typeof ds.updateImageStorageConfig
  readonly testImageStorageConnection: typeof ds.testImageStorageConnection
  readonly getSchedule: typeof ds.getSchedule
  readonly updateSchedule: typeof ds.updateSchedule
  readonly createBackup: typeof ds.createBackup
  readonly listBackups: typeof ds.listBackups
  readonly getBackup: typeof ds.getBackup
  readonly deleteBackup: typeof ds.deleteBackup
  readonly getDownloadURL: typeof ds.getDownloadURL
  readonly restoreBackup: typeof ds.restoreBackup
}
