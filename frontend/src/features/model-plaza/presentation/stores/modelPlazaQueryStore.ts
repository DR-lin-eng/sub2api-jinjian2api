import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { modelPlazaQueryRepository as defaultRepository } from '@/features/model-plaza/data/repositories/modelPlazaQueryRepositoryImpl'
import type { ModelPlazaResponse } from '@/features/model-plaza/domain/models/modelPlazaResponse'
import type { ModelPlazaQueryRepository } from '@/features/model-plaza/domain/repositories/modelPlazaQueryRepository'

export function createModelPlazaQueryStore(
  repository: ModelPlazaQueryRepository = defaultRepository,
) {
  return defineStore('modelPlaza/query', () => {
    const data = ref<ModelPlazaResponse | null>(null)
    const loading = reactive<Record<string, boolean>>({ get: false })
    const errors = reactive<Record<string, unknown>>({ get: null as unknown })

    const get: ModelPlazaQueryRepository['get'] = ((...args: unknown[]) => {
      loading.get = true
      errors.get = null
      return Promise.resolve()
        .then(() => (repository.get as (...params: unknown[]) => Promise<ModelPlazaResponse>)(...args))
        .then((response) => {
          data.value = response
          return response
        })
        .catch((error: unknown) => {
          errors.get = error
          throw error
        })
        .finally(() => {
          loading.get = false
        })
    }) as ModelPlazaQueryRepository['get']

    return { data, loading, errors, get }
  })
}

export const useModelPlazaQueryStore = createModelPlazaQueryStore()
