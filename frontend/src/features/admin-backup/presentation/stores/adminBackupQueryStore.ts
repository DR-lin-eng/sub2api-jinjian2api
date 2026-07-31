/**
 * AdminBackupQueryStore — spec §7 factory + default defineStore pair.
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminBackupQueryRepository } from '@/features/admin-backup/domain/repositories/adminBackupQueryRepository'
import { adminBackupQueryRepository as defaultRepo } from '@/features/admin-backup/data/repositories/adminBackupQueryRepositoryImpl'

type TaskKey =
  | 'getS3Config'
  | 'getImageStorageConfig'
  | 'getSchedule'
  | 'listBackups'
  | 'getBackup'
  | 'getDownloadURL'

export function createAdminBackupQueryStore(repo: AdminBackupQueryRepository = defaultRepo) {
  return defineStore('adminBackup/query', () => {
    const loading = reactive<Record<TaskKey, boolean>>({
      getS3Config: false,
      getImageStorageConfig: false,
      getSchedule: false,
      listBackups: false,
      getBackup: false,
      getDownloadURL: false,
    })
    const errors = reactive<Record<TaskKey, unknown>>({
      getS3Config: null,
      getImageStorageConfig: null,
      getSchedule: null,
      listBackups: null,
      getBackup: null,
      getDownloadURL: null,
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

    const getS3Config = () => run('getS3Config', () => repo.getS3Config())
    const getImageStorageConfig = () =>
      run('getImageStorageConfig', () => repo.getImageStorageConfig())
    const getSchedule = () => run('getSchedule', () => repo.getSchedule())
    const listBackups = () => run('listBackups', () => repo.listBackups())
    const getBackup = (id: string) => run('getBackup', () => repo.getBackup(id))
    const getDownloadURL = (id: string) => run('getDownloadURL', () => repo.getDownloadURL(id))

    return {
      loading,
      errors,
      getS3Config,
      getImageStorageConfig,
      getSchedule,
      listBackups,
      getBackup,
      getDownloadURL,
    }
  })
}

export const useAdminBackupQueryStore = createAdminBackupQueryStore()
