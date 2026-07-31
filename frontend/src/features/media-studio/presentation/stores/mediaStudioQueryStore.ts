import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { mediaStudioQueryRepository as defaultRepository } from '@/features/media-studio/data/repositories/mediaStudioQueryRepositoryImpl'
import type { MediaStudioQueryRepository } from '@/features/media-studio/domain/repositories/mediaStudioQueryRepository'

export function createMediaStudioQueryStore(
  repository: MediaStudioQueryRepository = defaultRepository,
) {
  return defineStore('mediaStudio/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false })
    const errors = reactive<Record<string, unknown>>({ list: null as unknown })

    const list: MediaStudioQueryRepository['list'] = ((...args: unknown[]) => {
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
    }) as MediaStudioQueryRepository['list']

    return { loading, errors, list }
  })
}

export const useMediaStudioQueryStore = createMediaStudioQueryStore()
