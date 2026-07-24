import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { DataManagementQueryRepository } from '@/features/admin-backup/domain/repositories/dataManagementQueryRepository'
import { dataManagementQueryRepository as defaultRepo } from '@/features/admin-backup/data/repositories/dataManagementQueryRepositoryImpl'
import type { ListBackupJobsRequest } from '@/features/admin-backup/data/requests_models/listBackupJobsRequest'
import type { SourceType } from '@/features/admin-backup/enums/sourceType'

type TaskKey =
  | 'getAgentHealth'
  | 'getConfig'
  | 'listSourceProfiles'
  | 'listS3Profiles'
  | 'listBackupJobs'
  | 'getBackupJob'

export function createDataManagementQueryStore(repo: DataManagementQueryRepository = defaultRepo) {
  return defineStore('dataManagement/query', () => {
    const loading = reactive<Record<TaskKey, boolean>>({
      getAgentHealth: false,
      getConfig: false,
      listSourceProfiles: false,
      listS3Profiles: false,
      listBackupJobs: false,
      getBackupJob: false,
    })
    const errors = reactive<Record<TaskKey, unknown>>({
      getAgentHealth: null,
      getConfig: null,
      listSourceProfiles: null,
      listS3Profiles: null,
      listBackupJobs: null,
      getBackupJob: null,
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

    const getAgentHealth = () => run('getAgentHealth', () => repo.getAgentHealth())
    const getConfig = () => run('getConfig', () => repo.getConfig())
    const listSourceProfiles = (sourceType: SourceType) =>
      run('listSourceProfiles', () => repo.listSourceProfiles(sourceType))
    const listS3Profiles = () => run('listS3Profiles', () => repo.listS3Profiles())
    const listBackupJobs = (request?: ListBackupJobsRequest) =>
      run('listBackupJobs', () => repo.listBackupJobs(request))
    const getBackupJob = (jobId: string) => run('getBackupJob', () => repo.getBackupJob(jobId))

    return {
      loading,
      errors,
      getAgentHealth,
      getConfig,
      listSourceProfiles,
      listS3Profiles,
      listBackupJobs,
      getBackupJob,
    }
  })
}

export const useDataManagementQueryStore = createDataManagementQueryStore()
