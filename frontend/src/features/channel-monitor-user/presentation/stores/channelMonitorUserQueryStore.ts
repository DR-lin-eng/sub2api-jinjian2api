import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { ChannelMonitorUserQueryRepository } from '@/features/channel-monitor-user/domain/repositories/channelMonitorUserQueryRepository'
import { channelMonitorUserQueryRepository as defaultRepo } from '@/features/channel-monitor-user/data/repositories/channelMonitorUserQueryRepositoryImpl'

export function createChannelMonitorUserQueryStore(
  repo: ChannelMonitorUserQueryRepository = defaultRepo,
) {
  return defineStore('channelMonitorUser/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false })
    const errors = reactive<Record<string, unknown>>({ list: null as unknown })

    const list: ChannelMonitorUserQueryRepository['list'] = ((...args: unknown[]) => {
      loading.list = true
      errors.list = null
      return Promise.resolve()
        .then(() => (repo.list as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.list = error; throw error })
        .finally(() => { loading.list = false })
    }) as ChannelMonitorUserQueryRepository['list']

    return { loading, errors, list }
  })
}

export const useChannelMonitorUserQueryStore = createChannelMonitorUserQueryStore()
