import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminSubscriptionsActionRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsActionRepository'
import { adminSubscriptionsActionRepository as defaultRepo } from '@/features/admin-subscriptions/data/repositories/adminSubscriptionsActionRepositoryImpl'

export function createAdminSubscriptionsActionStore(
  repo: AdminSubscriptionsActionRepository = defaultRepo,
) {
  return defineStore('adminSubscriptions/action', () => {
    const loading = reactive<Record<string, boolean>>({
      assign: false,
      bulkAssign: false,
      extend: false,
      revoke: false,
      restore: false,
      resetQuota: false,
    })
    const errors = reactive<Record<string, unknown>>({
      assign: null as unknown,
      bulkAssign: null as unknown,
      extend: null as unknown,
      revoke: null as unknown,
      restore: null as unknown,
      resetQuota: null as unknown,
    })

    const assign: AdminSubscriptionsActionRepository['assign'] = ((...args: unknown[]) => {
      loading.assign = true
      errors.assign = null
      return Promise.resolve()
        .then(() => (repo.assign as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.assign = e; throw e })
        .finally(() => { loading.assign = false })
    }) as AdminSubscriptionsActionRepository['assign']

    const bulkAssign: AdminSubscriptionsActionRepository['bulkAssign'] = ((...args: unknown[]) => {
      loading.bulkAssign = true
      errors.bulkAssign = null
      return Promise.resolve()
        .then(() => (repo.bulkAssign as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.bulkAssign = e; throw e })
        .finally(() => { loading.bulkAssign = false })
    }) as AdminSubscriptionsActionRepository['bulkAssign']

    const extend: AdminSubscriptionsActionRepository['extend'] = ((...args: unknown[]) => {
      loading.extend = true
      errors.extend = null
      return Promise.resolve()
        .then(() => (repo.extend as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.extend = e; throw e })
        .finally(() => { loading.extend = false })
    }) as AdminSubscriptionsActionRepository['extend']

    const revoke: AdminSubscriptionsActionRepository['revoke'] = ((...args: unknown[]) => {
      loading.revoke = true
      errors.revoke = null
      return Promise.resolve()
        .then(() => (repo.revoke as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.revoke = e; throw e })
        .finally(() => { loading.revoke = false })
    }) as AdminSubscriptionsActionRepository['revoke']

    const restore: AdminSubscriptionsActionRepository['restore'] = ((...args: unknown[]) => {
      loading.restore = true
      errors.restore = null
      return Promise.resolve()
        .then(() => (repo.restore as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.restore = e; throw e })
        .finally(() => { loading.restore = false })
    }) as AdminSubscriptionsActionRepository['restore']

    const resetQuota: AdminSubscriptionsActionRepository['resetQuota'] = ((...args: unknown[]) => {
      loading.resetQuota = true
      errors.resetQuota = null
      return Promise.resolve()
        .then(() => (repo.resetQuota as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.resetQuota = e; throw e })
        .finally(() => { loading.resetQuota = false })
    }) as AdminSubscriptionsActionRepository['resetQuota']

    return { loading, errors, assign, bulkAssign, extend, revoke, restore, resetQuota }
  })
}

export const useAdminSubscriptionsActionStore = createAdminSubscriptionsActionStore()
