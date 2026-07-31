import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { InstallResponse } from '@/features/setup/domain/models/installResponse'
import type { SetupActionRepository } from '@/features/setup/domain/repositories/setupActionRepository'
import type { TestDatabaseRequest } from '@/features/setup/data/requests_models/testDatabaseRequest'
import type { TestRedisRequest } from '@/features/setup/data/requests_models/testRedisRequest'
import type { InstallRequest } from '@/features/setup/data/requests_models/installRequest'
import { setupActionRepository as defaultRepo } from '@/features/setup/data/repositories/setupActionRepositoryImpl'

export function createSetupActionStore(repo: SetupActionRepository = defaultRepo) {
  return defineStore('setup/action', () => {
    const loading = reactive<Record<string, boolean>>({ testDatabase: false, testRedis: false, install: false })
    const errors = reactive<Record<string, unknown>>({ testDatabase: null as unknown, testRedis: null as unknown, install: null as unknown })

    async function testDatabase(req: TestDatabaseRequest): Promise<void> {
      loading.testDatabase = true
      errors.testDatabase = null
      try {
        await repo.testDatabase(req)
      } catch (error: unknown) {
        errors.testDatabase = error
        throw error
      } finally {
        loading.testDatabase = false
      }
    }

    async function testRedis(req: TestRedisRequest): Promise<void> {
      loading.testRedis = true
      errors.testRedis = null
      try {
        await repo.testRedis(req)
      } catch (error: unknown) {
        errors.testRedis = error
        throw error
      } finally {
        loading.testRedis = false
      }
    }

    async function install(req: InstallRequest): Promise<InstallResponse> {
      loading.install = true
      errors.install = null
      try {
        return await repo.install(req)
      } catch (error: unknown) {
        errors.install = error
        throw error
      } finally {
        loading.install = false
      }
    }

    return { loading, errors, testDatabase, testRedis, install }
  })
}

export const useSetupActionStore = createSetupActionStore()
