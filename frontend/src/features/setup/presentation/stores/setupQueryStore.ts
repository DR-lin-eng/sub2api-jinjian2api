import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { SetupStatus } from '@/features/setup/domain/models/setupStatus'
import type { SetupQueryRepository } from '@/features/setup/domain/repositories/setupQueryRepository'
import { setupQueryRepository as defaultRepo } from '@/features/setup/data/repositories/setupQueryRepositoryImpl'

export function createSetupQueryStore(repo: SetupQueryRepository = defaultRepo) {
  return defineStore('setup/query', () => {
    const setupStatus = ref<SetupStatus | null>(null)
    const loading = reactive<Record<string, boolean>>({ getSetupStatus: false })
    const errors = reactive<Record<string, unknown>>({ getSetupStatus: null as unknown })

    async function getSetupStatus(): Promise<void> {
      loading.getSetupStatus = true
      errors.getSetupStatus = null
      try {
        setupStatus.value = await repo.getSetupStatus()
      } catch (error: unknown) {
        errors.getSetupStatus = error
        throw error
      } finally {
        loading.getSetupStatus = false
      }
    }

    return { setupStatus, loading, errors, getSetupStatus }
  })
}

export const useSetupQueryStore = createSetupQueryStore()
