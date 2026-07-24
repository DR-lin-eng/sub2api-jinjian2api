import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { ChannelsUserQueryRepository } from '@/features/channels-user/domain/repositories/channelsUserQueryRepository'
import { channelsUserQueryRepository as defaultRepo } from '@/features/channels-user/data/repositories/channelsUserQueryRepositoryImpl'

export function createChannelsUserQueryStore(repo: ChannelsUserQueryRepository = defaultRepo) {
  return defineStore('channelsUser/query', () => {
    const loading = reactive<Record<string, boolean>>({ getAvailable: false })
    const errors = reactive<Record<string, unknown>>({ getAvailable: null as unknown })

    const getAvailable: ChannelsUserQueryRepository['getAvailable'] = ((...args: unknown[]) => {
      loading.getAvailable = true
      errors.getAvailable = null
      return Promise.resolve()
        .then(() => (repo.getAvailable as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.getAvailable = error; throw error })
        .finally(() => { loading.getAvailable = false })
    }) as ChannelsUserQueryRepository['getAvailable']

    return { loading, errors, getAvailable }
  })
}

export const useChannelsUserQueryStore = createChannelsUserQueryStore()
