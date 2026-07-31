import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { modelSquareQueryRepository as defaultRepository } from '@/features/model-square/data/repositories/modelSquareQueryRepositoryImpl'
import type { ModelSquareQueryRepository } from '@/features/model-square/domain/repositories/modelSquareQueryRepository'

export function createModelSquareQueryStore(
  repository: ModelSquareQueryRepository = defaultRepository,
) {
  return defineStore('modelSquare/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false })
    const errors = reactive<Record<string, unknown>>({ list: null as unknown })

    const list: ModelSquareQueryRepository['list'] = ((...args: unknown[]) => {
      loading.list = true
      errors.list = null
      return Promise.resolve()
        .then(() => (repository.list as (...params: unknown[]) => unknown)(...args))
        .catch((error: unknown) => {
          errors.list = error
          throw error
        })
        .finally(() => {
          loading.list = false
        })
    }) as ModelSquareQueryRepository['list']

    return { loading, errors, list }
  })
}

export const useModelSquareQueryStore = createModelSquareQueryStore()
