import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminSubscriptionsQueryRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsQueryRepository'
import { adminSubscriptionsQueryRepository as defaultRepo } from '@/features/admin-subscriptions/data/repositories/adminSubscriptionsQueryRepositoryImpl'

export function createAdminSubscriptionsQueryStore(
  repo: AdminSubscriptionsQueryRepository = defaultRepo,
) {
  return defineStore('adminSubscriptions/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false,
      getById: false,
      getProgress: false,
      listByGroup: false,
      listByUser: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null as unknown,
      getById: null as unknown,
      getProgress: null as unknown,
      listByGroup: null as unknown,
      listByUser: null as unknown,
    })

    const list: AdminSubscriptionsQueryRepository['list'] = ((...args: unknown[]) => {
      loading.list = true
      errors.list = null
      return Promise.resolve()
        .then(() => (repo.list as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.list = e; throw e })
        .finally(() => { loading.list = false })
    }) as AdminSubscriptionsQueryRepository['list']

    const getById: AdminSubscriptionsQueryRepository['getById'] = ((...args: unknown[]) => {
      loading.getById = true
      errors.getById = null
      return Promise.resolve()
        .then(() => (repo.getById as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getById = e; throw e })
        .finally(() => { loading.getById = false })
    }) as AdminSubscriptionsQueryRepository['getById']

    const getProgress: AdminSubscriptionsQueryRepository['getProgress'] = ((...args: unknown[]) => {
      loading.getProgress = true
      errors.getProgress = null
      return Promise.resolve()
        .then(() => (repo.getProgress as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getProgress = e; throw e })
        .finally(() => { loading.getProgress = false })
    }) as AdminSubscriptionsQueryRepository['getProgress']

    const listByGroup: AdminSubscriptionsQueryRepository['listByGroup'] = ((...args: unknown[]) => {
      loading.listByGroup = true
      errors.listByGroup = null
      return Promise.resolve()
        .then(() => (repo.listByGroup as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.listByGroup = e; throw e })
        .finally(() => { loading.listByGroup = false })
    }) as AdminSubscriptionsQueryRepository['listByGroup']

    const listByUser: AdminSubscriptionsQueryRepository['listByUser'] = ((...args: unknown[]) => {
      loading.listByUser = true
      errors.listByUser = null
      return Promise.resolve()
        .then(() => (repo.listByUser as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.listByUser = e; throw e })
        .finally(() => { loading.listByUser = false })
    }) as AdminSubscriptionsQueryRepository['listByUser']

    return { loading, errors, list, getById, getProgress, listByGroup, listByUser }
  })
}

export const useAdminSubscriptionsQueryStore = createAdminSubscriptionsQueryStore()
