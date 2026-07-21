/**
 * AdminBackupRepositoryImpl. Auto-generated from adminBackupDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-backup/data/datasources/adminBackupDatasource'
import type { AdminBackupRepository } from '@/features/admin-backup/domain/repositories/adminBackupRepository'

export class AdminBackupRepositoryImpl implements AdminBackupRepository {
  get getS3Config(): typeof ds.getS3Config { return ds.getS3Config }
  get updateS3Config(): typeof ds.updateS3Config { return ds.updateS3Config }
  get testS3Connection(): typeof ds.testS3Connection { return ds.testS3Connection }
  get getImageStorageConfig(): typeof ds.getImageStorageConfig { return ds.getImageStorageConfig }
  get updateImageStorageConfig(): typeof ds.updateImageStorageConfig { return ds.updateImageStorageConfig }
  get testImageStorageConnection(): typeof ds.testImageStorageConnection { return ds.testImageStorageConnection }
  get getSchedule(): typeof ds.getSchedule { return ds.getSchedule }
  get updateSchedule(): typeof ds.updateSchedule { return ds.updateSchedule }
  get createBackup(): typeof ds.createBackup { return ds.createBackup }
  get listBackups(): typeof ds.listBackups { return ds.listBackups }
  get getBackup(): typeof ds.getBackup { return ds.getBackup }
  get deleteBackup(): typeof ds.deleteBackup { return ds.deleteBackup }
  get getDownloadURL(): typeof ds.getDownloadURL { return ds.getDownloadURL }
  get restoreBackup(): typeof ds.restoreBackup { return ds.restoreBackup }
}

export const adminBackupRepository: AdminBackupRepository = new AdminBackupRepositoryImpl()
