import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminProxiesActionRepository } from '@/features/admin-proxies/domain/repositories/adminProxiesActionRepository'
import { adminProxiesActionRepository as defaultRepo } from '@/features/admin-proxies/data/repositories/adminProxiesActionRepositoryImpl'

export function createAdminProxiesActionStore(repo: AdminProxiesActionRepository = defaultRepo) {
  return defineStore('adminProxies/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false,
      update: false,
      deleteProxy: false,
      toggleStatus: false,
      testProxy: false,
      batchCreate: false,
      batchDelete: false,
      importData: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null as unknown,
      update: null as unknown,
      deleteProxy: null as unknown,
      toggleStatus: null as unknown,
      testProxy: null as unknown,
      batchCreate: null as unknown,
      batchDelete: null as unknown,
      importData: null as unknown,
    })

    const create: AdminProxiesActionRepository['create'] = ((...args: unknown[]) => {
      loading.create = true
      errors.create = null
      return Promise.resolve()
        .then(() => (repo.create as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.create = e; throw e })
        .finally(() => { loading.create = false })
    }) as AdminProxiesActionRepository['create']

    const update: AdminProxiesActionRepository['update'] = ((...args: unknown[]) => {
      loading.update = true
      errors.update = null
      return Promise.resolve()
        .then(() => (repo.update as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.update = e; throw e })
        .finally(() => { loading.update = false })
    }) as AdminProxiesActionRepository['update']

    const deleteProxy: AdminProxiesActionRepository['deleteProxy'] = ((...args: unknown[]) => {
      loading.deleteProxy = true
      errors.deleteProxy = null
      return Promise.resolve()
        .then(() => (repo.deleteProxy as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.deleteProxy = e; throw e })
        .finally(() => { loading.deleteProxy = false })
    }) as AdminProxiesActionRepository['deleteProxy']

    const toggleStatus: AdminProxiesActionRepository['toggleStatus'] = ((...args: unknown[]) => {
      loading.toggleStatus = true
      errors.toggleStatus = null
      return Promise.resolve()
        .then(() => (repo.toggleStatus as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.toggleStatus = e; throw e })
        .finally(() => { loading.toggleStatus = false })
    }) as AdminProxiesActionRepository['toggleStatus']

    const testProxy: AdminProxiesActionRepository['testProxy'] = ((...args: unknown[]) => {
      loading.testProxy = true
      errors.testProxy = null
      return Promise.resolve()
        .then(() => (repo.testProxy as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.testProxy = e; throw e })
        .finally(() => { loading.testProxy = false })
    }) as AdminProxiesActionRepository['testProxy']

    const batchCreate: AdminProxiesActionRepository['batchCreate'] = ((...args: unknown[]) => {
      loading.batchCreate = true
      errors.batchCreate = null
      return Promise.resolve()
        .then(() => (repo.batchCreate as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.batchCreate = e; throw e })
        .finally(() => { loading.batchCreate = false })
    }) as AdminProxiesActionRepository['batchCreate']

    const batchDelete: AdminProxiesActionRepository['batchDelete'] = ((...args: unknown[]) => {
      loading.batchDelete = true
      errors.batchDelete = null
      return Promise.resolve()
        .then(() => (repo.batchDelete as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.batchDelete = e; throw e })
        .finally(() => { loading.batchDelete = false })
    }) as AdminProxiesActionRepository['batchDelete']

    const importData: AdminProxiesActionRepository['importData'] = ((...args: unknown[]) => {
      loading.importData = true
      errors.importData = null
      return Promise.resolve()
        .then(() => (repo.importData as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.importData = e; throw e })
        .finally(() => { loading.importData = false })
    }) as AdminProxiesActionRepository['importData']

    return { loading, errors, create, update, deleteProxy, toggleStatus, testProxy, batchCreate, batchDelete, importData }
  })
}

export const useAdminProxiesActionStore = createAdminProxiesActionStore()
