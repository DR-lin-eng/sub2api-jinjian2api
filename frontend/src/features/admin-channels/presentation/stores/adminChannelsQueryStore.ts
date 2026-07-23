import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminChannelsQueryRepository } from '@/features/admin-channels/domain/repositories/adminChannelsQueryRepository'
import { adminChannelsQueryRepository as defaultRepo } from '@/features/admin-channels/data/repositories/adminChannelsQueryRepositoryImpl'

export function createAdminChannelsQueryStore(repo: AdminChannelsQueryRepository = defaultRepo) {
  return defineStore('adminChannels/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false,
      getById: false,
      getModelDefaultPricing: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null,
      getById: null,
      getModelDefaultPricing: null,
    })

    const list: AdminChannelsQueryRepository['list'] = (async (...args: unknown[]) => {
      loading.list = true
      errors.list = null
      try {
        return await (repo.list as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.list = e
        throw e
      } finally {
        loading.list = false
      }
    }) as AdminChannelsQueryRepository['list']

    const getById: AdminChannelsQueryRepository['getById'] = (async (...args: unknown[]) => {
      loading.getById = true
      errors.getById = null
      try {
        return await (repo.getById as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.getById = e
        throw e
      } finally {
        loading.getById = false
      }
    }) as AdminChannelsQueryRepository['getById']

    const getModelDefaultPricing: AdminChannelsQueryRepository['getModelDefaultPricing'] = (async (...args: unknown[]) => {
      loading.getModelDefaultPricing = true
      errors.getModelDefaultPricing = null
      try {
        return await (repo.getModelDefaultPricing as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.getModelDefaultPricing = e
        throw e
      } finally {
        loading.getModelDefaultPricing = false
      }
    }) as AdminChannelsQueryRepository['getModelDefaultPricing']

    return { loading, errors, list, getById, getModelDefaultPricing }
  })
}

export const useAdminChannelsQueryStore = createAdminChannelsQueryStore()
