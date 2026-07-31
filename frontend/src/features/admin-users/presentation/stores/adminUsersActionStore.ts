import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminUsersActionRepository } from '@/features/admin-users/domain/repositories/adminUsersActionRepository'
import type { UserAttributesActionRepository } from '@/features/admin-users/domain/repositories/userAttributesActionRepository'
import { adminUsersActionRepository as default_adminUsers_repo } from '@/features/admin-users/data/repositories/adminUsersActionRepositoryImpl'
import { userAttributesActionRepository as default_userAttributes_repo } from '@/features/admin-users/data/repositories/userAttributesActionRepositoryImpl'

export function createAdminUsersActionStore(
  adminUsersRepo: AdminUsersActionRepository = default_adminUsers_repo,
  userAttributesRepo: UserAttributesActionRepository = default_userAttributes_repo,
) {
  return defineStore('adminUsers/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false, update: false, deleteUser: false, updateBalance: false,
      batchUpdateLimits: false, replaceGroup: false, bindUserAuthIdentity: false,
      updatePlatformQuotas: false, resetPlatformQuotaWindow: false,
      createDefinition: false, updateDefinition: false, deleteDefinition: false,
      reorderDefinitions: false, updateUserAttributeValues: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null, update: null, deleteUser: null, updateBalance: null,
      batchUpdateLimits: null, replaceGroup: null, bindUserAuthIdentity: null,
      updatePlatformQuotas: null, resetPlatformQuotaWindow: null,
      createDefinition: null, updateDefinition: null, deleteDefinition: null,
      reorderDefinitions: null, updateUserAttributeValues: null,
    })

    const create: AdminUsersActionRepository['create'] = ((...args: unknown[]) => {
      loading.create = true; errors.create = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.create as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.create = e; throw e })
        .finally(() => { loading.create = false })
    }) as AdminUsersActionRepository['create']

    const update: AdminUsersActionRepository['update'] = ((...args: unknown[]) => {
      loading.update = true; errors.update = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.update as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.update = e; throw e })
        .finally(() => { loading.update = false })
    }) as AdminUsersActionRepository['update']

    const deleteUser: AdminUsersActionRepository['deleteUser'] = ((...args: unknown[]) => {
      loading.deleteUser = true; errors.deleteUser = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.deleteUser as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.deleteUser = e; throw e })
        .finally(() => { loading.deleteUser = false })
    }) as AdminUsersActionRepository['deleteUser']

    const updateBalance: AdminUsersActionRepository['updateBalance'] = ((...args: unknown[]) => {
      loading.updateBalance = true; errors.updateBalance = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.updateBalance as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.updateBalance = e; throw e })
        .finally(() => { loading.updateBalance = false })
    }) as AdminUsersActionRepository['updateBalance']

    const batchUpdateLimits: AdminUsersActionRepository['batchUpdateLimits'] = ((...args: unknown[]) => {
      loading.batchUpdateLimits = true; errors.batchUpdateLimits = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.batchUpdateLimits as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.batchUpdateLimits = e; throw e })
        .finally(() => { loading.batchUpdateLimits = false })
    }) as AdminUsersActionRepository['batchUpdateLimits']

    const replaceGroup: AdminUsersActionRepository['replaceGroup'] = ((...args: unknown[]) => {
      loading.replaceGroup = true; errors.replaceGroup = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.replaceGroup as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.replaceGroup = e; throw e })
        .finally(() => { loading.replaceGroup = false })
    }) as AdminUsersActionRepository['replaceGroup']

    const bindUserAuthIdentity: AdminUsersActionRepository['bindUserAuthIdentity'] = ((...args: unknown[]) => {
      loading.bindUserAuthIdentity = true; errors.bindUserAuthIdentity = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.bindUserAuthIdentity as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.bindUserAuthIdentity = e; throw e })
        .finally(() => { loading.bindUserAuthIdentity = false })
    }) as AdminUsersActionRepository['bindUserAuthIdentity']

    const updatePlatformQuotas: AdminUsersActionRepository['updatePlatformQuotas'] = ((...args: unknown[]) => {
      loading.updatePlatformQuotas = true; errors.updatePlatformQuotas = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.updatePlatformQuotas as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.updatePlatformQuotas = e; throw e })
        .finally(() => { loading.updatePlatformQuotas = false })
    }) as AdminUsersActionRepository['updatePlatformQuotas']

    const resetPlatformQuotaWindow: AdminUsersActionRepository['resetPlatformQuotaWindow'] = ((...args: unknown[]) => {
      loading.resetPlatformQuotaWindow = true; errors.resetPlatformQuotaWindow = null
      return Promise.resolve()
        .then(() => (adminUsersRepo.resetPlatformQuotaWindow as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.resetPlatformQuotaWindow = e; throw e })
        .finally(() => { loading.resetPlatformQuotaWindow = false })
    }) as AdminUsersActionRepository['resetPlatformQuotaWindow']

    const createDefinition: UserAttributesActionRepository['createDefinition'] = ((...args: unknown[]) => {
      loading.createDefinition = true; errors.createDefinition = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.createDefinition as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.createDefinition = e; throw e })
        .finally(() => { loading.createDefinition = false })
    }) as UserAttributesActionRepository['createDefinition']

    const updateDefinition: UserAttributesActionRepository['updateDefinition'] = ((...args: unknown[]) => {
      loading.updateDefinition = true; errors.updateDefinition = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.updateDefinition as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.updateDefinition = e; throw e })
        .finally(() => { loading.updateDefinition = false })
    }) as UserAttributesActionRepository['updateDefinition']

    const deleteDefinition: UserAttributesActionRepository['deleteDefinition'] = ((...args: unknown[]) => {
      loading.deleteDefinition = true; errors.deleteDefinition = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.deleteDefinition as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.deleteDefinition = e; throw e })
        .finally(() => { loading.deleteDefinition = false })
    }) as UserAttributesActionRepository['deleteDefinition']

    const reorderDefinitions: UserAttributesActionRepository['reorderDefinitions'] = ((...args: unknown[]) => {
      loading.reorderDefinitions = true; errors.reorderDefinitions = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.reorderDefinitions as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.reorderDefinitions = e; throw e })
        .finally(() => { loading.reorderDefinitions = false })
    }) as UserAttributesActionRepository['reorderDefinitions']

    const updateUserAttributeValues: UserAttributesActionRepository['updateUserAttributeValues'] = ((...args: unknown[]) => {
      loading.updateUserAttributeValues = true; errors.updateUserAttributeValues = null
      return Promise.resolve()
        .then(() => (userAttributesRepo.updateUserAttributeValues as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.updateUserAttributeValues = e; throw e })
        .finally(() => { loading.updateUserAttributeValues = false })
    }) as UserAttributesActionRepository['updateUserAttributeValues']

    return {
      loading, errors,
      create, update, deleteUser, updateBalance, batchUpdateLimits,
      replaceGroup, bindUserAuthIdentity, updatePlatformQuotas, resetPlatformQuotaWindow,
      createDefinition, updateDefinition, deleteDefinition, reorderDefinitions, updateUserAttributeValues,
    }
  })
}

export const useAdminUsersActionStore = createAdminUsersActionStore()
