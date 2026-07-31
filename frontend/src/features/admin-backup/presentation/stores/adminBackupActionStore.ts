import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminBackupActionRepository } from '@/features/admin-backup/domain/repositories/adminBackupActionRepository'
import { adminBackupActionRepository as defaultRepo } from '@/features/admin-backup/data/repositories/adminBackupActionRepositoryImpl'
import type { UpdateBackupS3ConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupS3ConfigRequest'
import type { UpdateBackupScheduleConfigRequest } from '@/features/admin-backup/data/requests_models/updateBackupScheduleConfigRequest'
import type { UpdateImageStorageConfigRequest } from '@/features/admin-backup/data/requests_models/updateImageStorageConfigRequest'
import type { CreateBackupRequest } from '@/features/admin-backup/data/requests_models/createBackupRequest'

type TaskKey =
  | 'updateS3Config'
  | 'testS3Connection'
  | 'updateImageStorageConfig'
  | 'testImageStorageConnection'
  | 'updateSchedule'
  | 'createBackup'
  | 'deleteBackup'
  | 'restoreBackup'

export function createAdminBackupActionStore(repo: AdminBackupActionRepository = defaultRepo) {
  return defineStore('adminBackup/action', () => {
    const loading = reactive<Record<TaskKey, boolean>>({
      updateS3Config: false,
      testS3Connection: false,
      updateImageStorageConfig: false,
      testImageStorageConnection: false,
      updateSchedule: false,
      createBackup: false,
      deleteBackup: false,
      restoreBackup: false,
    })
    const errors = reactive<Record<TaskKey, unknown>>({
      updateS3Config: null,
      testS3Connection: null,
      updateImageStorageConfig: null,
      testImageStorageConnection: null,
      updateSchedule: null,
      createBackup: null,
      deleteBackup: null,
      restoreBackup: null,
    })

    async function run<K extends TaskKey, T>(task: K, fn: () => Promise<T>): Promise<T> {
      loading[task] = true
      errors[task] = null
      try {
        return await fn()
      } catch (e) {
        errors[task] = e
        throw e
      } finally {
        loading[task] = false
      }
    }

    const updateS3Config = (req: UpdateBackupS3ConfigRequest) =>
      run('updateS3Config', () => repo.updateS3Config(req))
    const testS3Connection = (req: UpdateBackupS3ConfigRequest) =>
      run('testS3Connection', () => repo.testS3Connection(req))
    const updateImageStorageConfig = (req: UpdateImageStorageConfigRequest) =>
      run('updateImageStorageConfig', () => repo.updateImageStorageConfig(req))
    const testImageStorageConnection = (req: UpdateImageStorageConfigRequest) =>
      run('testImageStorageConnection', () => repo.testImageStorageConnection(req))
    const updateSchedule = (req: UpdateBackupScheduleConfigRequest) =>
      run('updateSchedule', () => repo.updateSchedule(req))
    const createBackup = (req?: CreateBackupRequest) =>
      run('createBackup', () => repo.createBackup(req))
    const deleteBackup = (id: string) => run('deleteBackup', () => repo.deleteBackup(id))
    const restoreBackup = (id: string, password: string) =>
      run('restoreBackup', () => repo.restoreBackup(id, password))

    return {
      loading,
      errors,
      updateS3Config,
      testS3Connection,
      updateImageStorageConfig,
      testImageStorageConnection,
      updateSchedule,
      createBackup,
      deleteBackup,
      restoreBackup,
    }
  })
}

export const useAdminBackupActionStore = createAdminBackupActionStore()
