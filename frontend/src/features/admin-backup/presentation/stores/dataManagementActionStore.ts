import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { DataManagementActionRepository } from '@/features/admin-backup/domain/repositories/dataManagementActionRepository'
import { dataManagementActionRepository as defaultRepo } from '@/features/admin-backup/data/repositories/dataManagementActionRepositoryImpl'
import type { UpdateDataManagementConfigRequest } from '@/features/admin-backup/data/requests_models/updateDataManagementConfigRequest'
import type { TestS3Request } from '@/features/admin-backup/data/requests_models/testS3Request'
import type { CreateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/createSourceProfileRequest'
import type { UpdateSourceProfileRequest } from '@/features/admin-backup/data/requests_models/updateSourceProfileRequest'
import type { CreateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/createS3ProfileRequest'
import type { UpdateS3ProfileRequest } from '@/features/admin-backup/data/requests_models/updateS3ProfileRequest'
import type { CreateBackupJobRequest } from '@/features/admin-backup/data/requests_models/createBackupJobRequest'
import type { SourceType } from '@/features/admin-backup/domain/models/sourceType'

type TaskKey =
  | 'updateConfig'
  | 'testS3'
  | 'createSourceProfile'
  | 'updateSourceProfile'
  | 'deleteSourceProfile'
  | 'setActiveSourceProfile'
  | 'createS3Profile'
  | 'updateS3Profile'
  | 'deleteS3Profile'
  | 'setActiveS3Profile'
  | 'createBackupJob'

export function createDataManagementActionStore(repo: DataManagementActionRepository = defaultRepo) {
  return defineStore('dataManagement/action', () => {
    const loading = reactive<Record<TaskKey, boolean>>({
      updateConfig: false,
      testS3: false,
      createSourceProfile: false,
      updateSourceProfile: false,
      deleteSourceProfile: false,
      setActiveSourceProfile: false,
      createS3Profile: false,
      updateS3Profile: false,
      deleteS3Profile: false,
      setActiveS3Profile: false,
      createBackupJob: false,
    })
    const errors = reactive<Record<TaskKey, unknown>>({
      updateConfig: null,
      testS3: null,
      createSourceProfile: null,
      updateSourceProfile: null,
      deleteSourceProfile: null,
      setActiveSourceProfile: null,
      createS3Profile: null,
      updateS3Profile: null,
      deleteS3Profile: null,
      setActiveS3Profile: null,
      createBackupJob: null,
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

    const updateConfig = (req: UpdateDataManagementConfigRequest) =>
      run('updateConfig', () => repo.updateConfig(req))
    const testS3 = (req: TestS3Request) => run('testS3', () => repo.testS3(req))
    const createSourceProfile = (sourceType: SourceType, req: CreateSourceProfileRequest) =>
      run('createSourceProfile', () => repo.createSourceProfile(sourceType, req))
    const updateSourceProfile = (sourceType: SourceType, profileId: string, req: UpdateSourceProfileRequest) =>
      run('updateSourceProfile', () => repo.updateSourceProfile(sourceType, profileId, req))
    const deleteSourceProfile = (sourceType: SourceType, profileId: string) =>
      run('deleteSourceProfile', () => repo.deleteSourceProfile(sourceType, profileId))
    const setActiveSourceProfile = (sourceType: SourceType, profileId: string) =>
      run('setActiveSourceProfile', () => repo.setActiveSourceProfile(sourceType, profileId))
    const createS3Profile = (req: CreateS3ProfileRequest) =>
      run('createS3Profile', () => repo.createS3Profile(req))
    const updateS3Profile = (profileId: string, req: UpdateS3ProfileRequest) =>
      run('updateS3Profile', () => repo.updateS3Profile(profileId, req))
    const deleteS3Profile = (profileId: string) =>
      run('deleteS3Profile', () => repo.deleteS3Profile(profileId))
    const setActiveS3Profile = (profileId: string) =>
      run('setActiveS3Profile', () => repo.setActiveS3Profile(profileId))
    const createBackupJob = (req: CreateBackupJobRequest) =>
      run('createBackupJob', () => repo.createBackupJob(req))

    return {
      loading,
      errors,
      updateConfig,
      testS3,
      createSourceProfile,
      updateSourceProfile,
      deleteSourceProfile,
      setActiveSourceProfile,
      createS3Profile,
      updateS3Profile,
      deleteS3Profile,
      setActiveS3Profile,
      createBackupJob,
    }
  })
}

export const useDataManagementActionStore = createDataManagementActionStore()
