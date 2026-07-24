import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { ChannelMonitorUserActionRepository } from '@/features/channel-monitor-user/domain/repositories/channelMonitorUserActionRepository'
import { channelMonitorUserActionRepository as defaultRepo } from '@/features/channel-monitor-user/data/repositories/channelMonitorUserActionRepositoryImpl'

export function createChannelMonitorUserActionStore(
  repo: ChannelMonitorUserActionRepository = defaultRepo,
) {
  return defineStore('channelMonitorUser/action', () => {
    const loading = reactive<Record<string, boolean>>({ status: false, statusBatch: false })
    const errors = reactive<Record<string, unknown>>({ status: null as unknown, statusBatch: null as unknown })

    const status: ChannelMonitorUserActionRepository['status'] = ((...args: unknown[]) => {
      loading.status = true
      errors.status = null
      return Promise.resolve()
        .then(() => (repo.status as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.status = error; throw error })
        .finally(() => { loading.status = false })
    }) as ChannelMonitorUserActionRepository['status']

    const statusBatch: ChannelMonitorUserActionRepository['statusBatch'] = ((...args: unknown[]) => {
      loading.statusBatch = true
      errors.statusBatch = null
      return Promise.resolve()
        .then(() => (repo.statusBatch as (...a: unknown[]) => unknown)(...args))
        .catch((error: unknown) => { errors.statusBatch = error; throw error })
        .finally(() => { loading.statusBatch = false })
    }) as ChannelMonitorUserActionRepository['statusBatch']

    return { loading, errors, status, statusBatch }
  })
}

export const useChannelMonitorUserActionStore = createChannelMonitorUserActionStore()
