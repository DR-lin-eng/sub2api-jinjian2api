import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminProxiesQueryRepository } from '@/features/admin-proxies/domain/repositories/adminProxiesQueryRepository'
import { adminProxiesQueryRepository as defaultRepo } from '@/features/admin-proxies/data/repositories/adminProxiesQueryRepositoryImpl'

export function createAdminProxiesQueryStore(repo: AdminProxiesQueryRepository = defaultRepo) {
  return defineStore('adminProxies/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false,
      getAll: false,
      getAllWithCount: false,
      getById: false,
      checkProxyQuality: false,
      getStats: false,
      getProxyAccounts: false,
      exportData: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null as unknown,
      getAll: null as unknown,
      getAllWithCount: null as unknown,
      getById: null as unknown,
      checkProxyQuality: null as unknown,
      getStats: null as unknown,
      getProxyAccounts: null as unknown,
      exportData: null as unknown,
    })

    const list: AdminProxiesQueryRepository['list'] = ((...args: unknown[]) => {
      loading.list = true
      errors.list = null
      return Promise.resolve()
        .then(() => (repo.list as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.list = e; throw e })
        .finally(() => { loading.list = false })
    }) as AdminProxiesQueryRepository['list']

    const getAll: AdminProxiesQueryRepository['getAll'] = ((...args: unknown[]) => {
      loading.getAll = true
      errors.getAll = null
      return Promise.resolve()
        .then(() => (repo.getAll as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getAll = e; throw e })
        .finally(() => { loading.getAll = false })
    }) as AdminProxiesQueryRepository['getAll']

    const getAllWithCount: AdminProxiesQueryRepository['getAllWithCount'] = ((...args: unknown[]) => {
      loading.getAllWithCount = true
      errors.getAllWithCount = null
      return Promise.resolve()
        .then(() => (repo.getAllWithCount as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getAllWithCount = e; throw e })
        .finally(() => { loading.getAllWithCount = false })
    }) as AdminProxiesQueryRepository['getAllWithCount']

    const getById: AdminProxiesQueryRepository['getById'] = ((...args: unknown[]) => {
      loading.getById = true
      errors.getById = null
      return Promise.resolve()
        .then(() => (repo.getById as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getById = e; throw e })
        .finally(() => { loading.getById = false })
    }) as AdminProxiesQueryRepository['getById']

    const checkProxyQuality: AdminProxiesQueryRepository['checkProxyQuality'] = ((...args: unknown[]) => {
      loading.checkProxyQuality = true
      errors.checkProxyQuality = null
      return Promise.resolve()
        .then(() => (repo.checkProxyQuality as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.checkProxyQuality = e; throw e })
        .finally(() => { loading.checkProxyQuality = false })
    }) as AdminProxiesQueryRepository['checkProxyQuality']

    const getStats: AdminProxiesQueryRepository['getStats'] = ((...args: unknown[]) => {
      loading.getStats = true
      errors.getStats = null
      return Promise.resolve()
        .then(() => (repo.getStats as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getStats = e; throw e })
        .finally(() => { loading.getStats = false })
    }) as AdminProxiesQueryRepository['getStats']

    const getProxyAccounts: AdminProxiesQueryRepository['getProxyAccounts'] = ((...args: unknown[]) => {
      loading.getProxyAccounts = true
      errors.getProxyAccounts = null
      return Promise.resolve()
        .then(() => (repo.getProxyAccounts as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getProxyAccounts = e; throw e })
        .finally(() => { loading.getProxyAccounts = false })
    }) as AdminProxiesQueryRepository['getProxyAccounts']

    const exportData: AdminProxiesQueryRepository['exportData'] = ((...args: unknown[]) => {
      loading.exportData = true
      errors.exportData = null
      return Promise.resolve()
        .then(() => (repo.exportData as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.exportData = e; throw e })
        .finally(() => { loading.exportData = false })
    }) as AdminProxiesQueryRepository['exportData']

    return { loading, errors, list, getAll, getAllWithCount, getById, checkProxyQuality, getStats, getProxyAccounts, exportData }
  })
}

export const useAdminProxiesQueryStore = createAdminProxiesQueryStore()
