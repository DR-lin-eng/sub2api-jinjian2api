import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminUsersQueryRepository } from '@/features/admin-users/domain/repositories/adminUsersQueryRepository'
import type { UserAttributesQueryRepository } from '@/features/admin-users/domain/repositories/userAttributesQueryRepository'
import { adminUsersQueryRepository as default_adminUsers_repo } from '@/features/admin-users/data/repositories/adminUsersQueryRepositoryImpl'
import { userAttributesQueryRepository as default_userAttributes_repo } from '@/features/admin-users/data/repositories/userAttributesQueryRepositoryImpl'

export function createAdminUsersQueryStore(
  adminUsersRepo: AdminUsersQueryRepository = default_adminUsers_repo,
  userAttributesRepo: UserAttributesQueryRepository = default_userAttributes_repo,
) {
  return defineStore('adminUsers/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false, getById: false, getUserApiKeys: false, getUserUsageStats: false,
      getUserBalanceHistory: false, getPlatformQuotas: false, getBatchPlatformQuotas: false,
      listDefinitions: false, listEnabledDefinitions: false, getUserAttributeValues: false,
      getBatchUserAttributes: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null, getById: null, getUserApiKeys: null, getUserUsageStats: null,
      getUserBalanceHistory: null, getPlatformQuotas: null, getBatchPlatformQuotas: null,
      listDefinitions: null, listEnabledDefinitions: null, getUserAttributeValues: null,
      getBatchUserAttributes: null,
    })

    const list: AdminUsersQueryRepository['list'] = ((...args: unknown[]) => {
      loading.list = true; errors.list = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.list as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.list = e; throw e })
        .finally(() => { loading.list = false })
    }) as AdminUsersQueryRepository['list']

    const getById: AdminUsersQueryRepository['getById'] = ((...args: unknown[]) => {
      loading.getById = true; errors.getById = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.getById as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getById = e; throw e })
        .finally(() => { loading.getById = false })
    }) as AdminUsersQueryRepository['getById']

    const getUserApiKeys: AdminUsersQueryRepository['getUserApiKeys'] = ((...args: unknown[]) => {
      loading.getUserApiKeys = true; errors.getUserApiKeys = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.getUserApiKeys as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getUserApiKeys = e; throw e })
        .finally(() => { loading.getUserApiKeys = false })
    }) as AdminUsersQueryRepository['getUserApiKeys']

    const getUserUsageStats: AdminUsersQueryRepository['getUserUsageStats'] = ((...args: unknown[]) => {
      loading.getUserUsageStats = true; errors.getUserUsageStats = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.getUserUsageStats as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getUserUsageStats = e; throw e })
        .finally(() => { loading.getUserUsageStats = false })
    }) as AdminUsersQueryRepository['getUserUsageStats']

    const getUserBalanceHistory: AdminUsersQueryRepository['getUserBalanceHistory'] = ((...args: unknown[]) => {
      loading.getUserBalanceHistory = true; errors.getUserBalanceHistory = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.getUserBalanceHistory as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getUserBalanceHistory = e; throw e })
        .finally(() => { loading.getUserBalanceHistory = false })
    }) as AdminUsersQueryRepository['getUserBalanceHistory']

    const getPlatformQuotas: AdminUsersQueryRepository['getPlatformQuotas'] = ((...args: unknown[]) => {
      loading.getPlatformQuotas = true; errors.getPlatformQuotas = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.getPlatformQuotas as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getPlatformQuotas = e; throw e })
        .finally(() => { loading.getPlatformQuotas = false })
    }) as AdminUsersQueryRepository['getPlatformQuotas']

    const getBatchPlatformQuotas: AdminUsersQueryRepository['getBatchPlatformQuotas'] = ((...args: unknown[]) => {
      loading.getBatchPlatformQuotas = true; errors.getBatchPlatformQuotas = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.getBatchPlatformQuotas as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getBatchPlatformQuotas = e; throw e })
        .finally(() => { loading.getBatchPlatformQuotas = false })
    }) as AdminUsersQueryRepository['getBatchPlatformQuotas']

    const listDefinitions: UserAttributesQueryRepository['listDefinitions'] = ((...args: unknown[]) => {
      loading.listDefinitions = true; errors.listDefinitions = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.listDefinitions as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.listDefinitions = e; throw e })
        .finally(() => { loading.listDefinitions = false })
    }) as UserAttributesQueryRepository['listDefinitions']

    const listEnabledDefinitions: UserAttributesQueryRepository['listEnabledDefinitions'] = ((...args: unknown[]) => {
      loading.listEnabledDefinitions = true; errors.listEnabledDefinitions = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.listEnabledDefinitions as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.listEnabledDefinitions = e; throw e })
        .finally(() => { loading.listEnabledDefinitions = false })
    }) as UserAttributesQueryRepository['listEnabledDefinitions']

    const getUserAttributeValues: UserAttributesQueryRepository['getUserAttributeValues'] = ((...args: unknown[]) => {
      loading.getUserAttributeValues = true; errors.getUserAttributeValues = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.getUserAttributeValues as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getUserAttributeValues = e; throw e })
        .finally(() => { loading.getUserAttributeValues = false })
    }) as UserAttributesQueryRepository['getUserAttributeValues']

    const getBatchUserAttributes: UserAttributesQueryRepository['getBatchUserAttributes'] = ((...args: unknown[]) => {
      loading.getBatchUserAttributes = true; errors.getBatchUserAttributes = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.getBatchUserAttributes as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getBatchUserAttributes = e; throw e })
        .finally(() => { loading.getBatchUserAttributes = false })
    }) as UserAttributesQueryRepository['getBatchUserAttributes']

    return {
      loading, errors,
      list, getById, getUserApiKeys, getUserUsageStats, getUserBalanceHistory,
      getPlatformQuotas, getBatchPlatformQuotas,
      listDefinitions, listEnabledDefinitions, getUserAttributeValues, getBatchUserAttributes,
    }
  })
}

export const useAdminUsersQueryStore = createAdminUsersQueryStore()
