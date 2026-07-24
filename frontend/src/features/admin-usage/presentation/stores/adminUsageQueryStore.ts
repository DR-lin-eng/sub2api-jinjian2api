import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminUsageQueryRepository } from '@/features/admin-usage/domain/repositories/adminUsageQueryRepository'
import { adminUsageQueryRepository as defaultRepo } from '@/features/admin-usage/data/repositories/adminUsageQueryRepositoryImpl'
import type { AdminUsageQueryParams } from '@/features/admin-usage/domain/models/adminUsageQueryParams'

export function createAdminUsageQueryStore(repo: AdminUsageQueryRepository = defaultRepo) {
  return defineStore('adminUsage/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false, getStats: false, searchUsers: false, searchApiKeys: false, listCleanupTasks: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null, getStats: null, searchUsers: null, searchApiKeys: null, listCleanupTasks: null,
    })

    const list = (params: Partial<AdminUsageQueryParams>, options?: { signal?: AbortSignal }) => {
      loading.list = true
      errors.list = null
      return repo.list(params, options)
        .catch((e: unknown) => { errors.list = e; throw e })
        .finally(() => { loading.list = false })
    }

    const getStats: AdminUsageQueryRepository['getStats'] = ((...args: Parameters<AdminUsageQueryRepository['getStats']>) => {
      loading.getStats = true
      errors.getStats = null
      return repo.getStats(...args)
        .catch((e: unknown) => { errors.getStats = e; throw e })
        .finally(() => { loading.getStats = false })
    }) as AdminUsageQueryRepository['getStats']

    const searchUsers: AdminUsageQueryRepository['searchUsers'] = ((...args: Parameters<AdminUsageQueryRepository['searchUsers']>) => {
      loading.searchUsers = true
      errors.searchUsers = null
      return repo.searchUsers(...args)
        .catch((e: unknown) => { errors.searchUsers = e; throw e })
        .finally(() => { loading.searchUsers = false })
    }) as AdminUsageQueryRepository['searchUsers']

    const searchApiKeys: AdminUsageQueryRepository['searchApiKeys'] = ((...args: Parameters<AdminUsageQueryRepository['searchApiKeys']>) => {
      loading.searchApiKeys = true
      errors.searchApiKeys = null
      return repo.searchApiKeys(...args)
        .catch((e: unknown) => { errors.searchApiKeys = e; throw e })
        .finally(() => { loading.searchApiKeys = false })
    }) as AdminUsageQueryRepository['searchApiKeys']

    const listCleanupTasks: AdminUsageQueryRepository['listCleanupTasks'] = ((...args: Parameters<AdminUsageQueryRepository['listCleanupTasks']>) => {
      loading.listCleanupTasks = true
      errors.listCleanupTasks = null
      return repo.listCleanupTasks(...args)
        .catch((e: unknown) => { errors.listCleanupTasks = e; throw e })
        .finally(() => { loading.listCleanupTasks = false })
    }) as AdminUsageQueryRepository['listCleanupTasks']

    return { loading, errors, list, getStats, searchUsers, searchApiKeys, listCleanupTasks }
  })
}

export const useAdminUsageQueryStore = createAdminUsageQueryStore()
