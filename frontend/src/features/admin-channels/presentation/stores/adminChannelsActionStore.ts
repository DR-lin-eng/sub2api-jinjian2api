import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminChannelsActionRepository } from '@/features/admin-channels/domain/repositories/adminChannelsActionRepository'
import { adminChannelsActionRepository as defaultRepo } from '@/features/admin-channels/data/repositories/adminChannelsActionRepositoryImpl'

export function createAdminChannelsActionStore(repo: AdminChannelsActionRepository = defaultRepo) {
  return defineStore('adminChannels/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false,
      update: false,
      remove: false,
      syncPricingModels: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null,
      update: null,
      remove: null,
      syncPricingModels: null,
    })

    const create: AdminChannelsActionRepository['create'] = (async (...args: unknown[]) => {
      loading.create = true
      errors.create = null
      try {
        return await (repo.create as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.create = e
        throw e
      } finally {
        loading.create = false
      }
    }) as AdminChannelsActionRepository['create']

    const update: AdminChannelsActionRepository['update'] = (async (...args: unknown[]) => {
      loading.update = true
      errors.update = null
      try {
        return await (repo.update as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.update = e
        throw e
      } finally {
        loading.update = false
      }
    }) as AdminChannelsActionRepository['update']

    const remove: AdminChannelsActionRepository['remove'] = (async (...args: unknown[]) => {
      loading.remove = true
      errors.remove = null
      try {
        return await (repo.remove as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.remove = e
        throw e
      } finally {
        loading.remove = false
      }
    }) as AdminChannelsActionRepository['remove']

    const syncPricingModels: AdminChannelsActionRepository['syncPricingModels'] = (async (...args: unknown[]) => {
      loading.syncPricingModels = true
      errors.syncPricingModels = null
      try {
        return await (repo.syncPricingModels as (...a: unknown[]) => unknown)(...args)
      } catch (e) {
        errors.syncPricingModels = e
        throw e
      } finally {
        loading.syncPricingModels = false
      }
    }) as AdminChannelsActionRepository['syncPricingModels']

    return { loading, errors, create, update, remove, syncPricingModels }
  })
}

export const useAdminChannelsActionStore = createAdminChannelsActionStore()
