import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminUsageActionRepository } from '@/features/admin-usage/domain/repositories/adminUsageActionRepository'
import { adminUsageActionRepository as defaultRepo } from '@/features/admin-usage/data/repositories/adminUsageActionRepositoryImpl'

export function createAdminUsageActionStore(repo: AdminUsageActionRepository = defaultRepo) {
  return defineStore('adminUsage/action', () => {
    const loading = reactive<Record<string, boolean>>({
      createCleanupTask: false, cancelCleanupTask: false, updateApiKeyGroup: false,
    })
    const errors = reactive<Record<string, unknown>>({
      createCleanupTask: null, cancelCleanupTask: null, updateApiKeyGroup: null,
    })

    const createCleanupTask: AdminUsageActionRepository['createCleanupTask'] = ((...args: Parameters<AdminUsageActionRepository['createCleanupTask']>) => {
      loading.createCleanupTask = true
      errors.createCleanupTask = null
      return repo.createCleanupTask(...args)
        .catch((e: unknown) => { errors.createCleanupTask = e; throw e })
        .finally(() => { loading.createCleanupTask = false })
    }) as AdminUsageActionRepository['createCleanupTask']

    const cancelCleanupTask: AdminUsageActionRepository['cancelCleanupTask'] = ((...args: Parameters<AdminUsageActionRepository['cancelCleanupTask']>) => {
      loading.cancelCleanupTask = true
      errors.cancelCleanupTask = null
      return repo.cancelCleanupTask(...args)
        .catch((e: unknown) => { errors.cancelCleanupTask = e; throw e })
        .finally(() => { loading.cancelCleanupTask = false })
    }) as AdminUsageActionRepository['cancelCleanupTask']

    const updateApiKeyGroup: AdminUsageActionRepository['updateApiKeyGroup'] = ((...args: Parameters<AdminUsageActionRepository['updateApiKeyGroup']>) => {
      loading.updateApiKeyGroup = true
      errors.updateApiKeyGroup = null
      return repo.updateApiKeyGroup(...args)
        .catch((e: unknown) => { errors.updateApiKeyGroup = e; throw e })
        .finally(() => { loading.updateApiKeyGroup = false })
    }) as AdminUsageActionRepository['updateApiKeyGroup']

    return { loading, errors, createCleanupTask, cancelCleanupTask, updateApiKeyGroup }
  })
}

export const useAdminUsageActionStore = createAdminUsageActionStore()
