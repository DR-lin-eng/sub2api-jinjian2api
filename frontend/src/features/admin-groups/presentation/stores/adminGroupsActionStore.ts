import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminGroupsActionRepository } from '@/features/admin-groups/domain/repositories/adminGroupsActionRepository'
import { adminGroupsActionRepository as defaultRepo } from '@/features/admin-groups/data/repositories/adminGroupsActionRepositoryImpl'

export function createAdminGroupsActionStore(repo: AdminGroupsActionRepository = defaultRepo) {
  return defineStore('adminGroups/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false, duplicate: false, update: false, deleteGroup: false, toggleStatus: false,
      createCompositeRoute: false, updateCompositeRoute: false, deleteCompositeRoute: false,
      updateSortOrder: false, clearGroupRateMultipliers: false, batchSetGroupRateMultipliers: false,
      batchSetGroupRPMOverrides: false, clearGroupRPMOverrides: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null, duplicate: null, update: null, deleteGroup: null, toggleStatus: null,
      createCompositeRoute: null, updateCompositeRoute: null, deleteCompositeRoute: null,
      updateSortOrder: null, clearGroupRateMultipliers: null, batchSetGroupRateMultipliers: null,
      batchSetGroupRPMOverrides: null, clearGroupRPMOverrides: null,
    })

    const create: AdminGroupsActionRepository['create'] = ((...args: Parameters<AdminGroupsActionRepository['create']>) => {
      loading.create = true
      errors.create = null
      return repo.create(...args)
        .catch((error: unknown) => { errors.create = error; throw error })
        .finally(() => { loading.create = false })
    })

    const duplicate: AdminGroupsActionRepository['duplicate'] = ((...args: Parameters<AdminGroupsActionRepository['duplicate']>) => {
      loading.duplicate = true
      errors.duplicate = null
      return repo.duplicate(...args)
        .catch((error: unknown) => { errors.duplicate = error; throw error })
        .finally(() => { loading.duplicate = false })
    })

    const update: AdminGroupsActionRepository['update'] = ((...args: Parameters<AdminGroupsActionRepository['update']>) => {
      loading.update = true
      errors.update = null
      return repo.update(...args)
        .catch((error: unknown) => { errors.update = error; throw error })
        .finally(() => { loading.update = false })
    })

    const deleteGroup: AdminGroupsActionRepository['deleteGroup'] = ((...args: Parameters<AdminGroupsActionRepository['deleteGroup']>) => {
      loading.deleteGroup = true
      errors.deleteGroup = null
      return repo.deleteGroup(...args)
        .catch((error: unknown) => { errors.deleteGroup = error; throw error })
        .finally(() => { loading.deleteGroup = false })
    })

    const toggleStatus: AdminGroupsActionRepository['toggleStatus'] = ((...args: Parameters<AdminGroupsActionRepository['toggleStatus']>) => {
      loading.toggleStatus = true
      errors.toggleStatus = null
      return repo.toggleStatus(...args)
        .catch((error: unknown) => { errors.toggleStatus = error; throw error })
        .finally(() => { loading.toggleStatus = false })
    })

    const createCompositeRoute: AdminGroupsActionRepository['createCompositeRoute'] = ((...args: Parameters<AdminGroupsActionRepository['createCompositeRoute']>) => {
      loading.createCompositeRoute = true
      errors.createCompositeRoute = null
      return repo.createCompositeRoute(...args)
        .catch((error: unknown) => { errors.createCompositeRoute = error; throw error })
        .finally(() => { loading.createCompositeRoute = false })
    })

    const updateCompositeRoute: AdminGroupsActionRepository['updateCompositeRoute'] = ((...args: Parameters<AdminGroupsActionRepository['updateCompositeRoute']>) => {
      loading.updateCompositeRoute = true
      errors.updateCompositeRoute = null
      return repo.updateCompositeRoute(...args)
        .catch((error: unknown) => { errors.updateCompositeRoute = error; throw error })
        .finally(() => { loading.updateCompositeRoute = false })
    })

    const deleteCompositeRoute: AdminGroupsActionRepository['deleteCompositeRoute'] = ((...args: Parameters<AdminGroupsActionRepository['deleteCompositeRoute']>) => {
      loading.deleteCompositeRoute = true
      errors.deleteCompositeRoute = null
      return repo.deleteCompositeRoute(...args)
        .catch((error: unknown) => { errors.deleteCompositeRoute = error; throw error })
        .finally(() => { loading.deleteCompositeRoute = false })
    })

    const updateSortOrder: AdminGroupsActionRepository['updateSortOrder'] = ((...args: Parameters<AdminGroupsActionRepository['updateSortOrder']>) => {
      loading.updateSortOrder = true
      errors.updateSortOrder = null
      return repo.updateSortOrder(...args)
        .catch((error: unknown) => { errors.updateSortOrder = error; throw error })
        .finally(() => { loading.updateSortOrder = false })
    })

    const clearGroupRateMultipliers: AdminGroupsActionRepository['clearGroupRateMultipliers'] = ((...args: Parameters<AdminGroupsActionRepository['clearGroupRateMultipliers']>) => {
      loading.clearGroupRateMultipliers = true
      errors.clearGroupRateMultipliers = null
      return repo.clearGroupRateMultipliers(...args)
        .catch((error: unknown) => { errors.clearGroupRateMultipliers = error; throw error })
        .finally(() => { loading.clearGroupRateMultipliers = false })
    })

    const batchSetGroupRateMultipliers: AdminGroupsActionRepository['batchSetGroupRateMultipliers'] = ((...args: Parameters<AdminGroupsActionRepository['batchSetGroupRateMultipliers']>) => {
      loading.batchSetGroupRateMultipliers = true
      errors.batchSetGroupRateMultipliers = null
      return repo.batchSetGroupRateMultipliers(...args)
        .catch((error: unknown) => { errors.batchSetGroupRateMultipliers = error; throw error })
        .finally(() => { loading.batchSetGroupRateMultipliers = false })
    })

    const batchSetGroupRPMOverrides: AdminGroupsActionRepository['batchSetGroupRPMOverrides'] = ((...args: Parameters<AdminGroupsActionRepository['batchSetGroupRPMOverrides']>) => {
      loading.batchSetGroupRPMOverrides = true
      errors.batchSetGroupRPMOverrides = null
      return repo.batchSetGroupRPMOverrides(...args)
        .catch((error: unknown) => { errors.batchSetGroupRPMOverrides = error; throw error })
        .finally(() => { loading.batchSetGroupRPMOverrides = false })
    })

    const clearGroupRPMOverrides: AdminGroupsActionRepository['clearGroupRPMOverrides'] = ((...args: Parameters<AdminGroupsActionRepository['clearGroupRPMOverrides']>) => {
      loading.clearGroupRPMOverrides = true
      errors.clearGroupRPMOverrides = null
      return repo.clearGroupRPMOverrides(...args)
        .catch((error: unknown) => { errors.clearGroupRPMOverrides = error; throw error })
        .finally(() => { loading.clearGroupRPMOverrides = false })
    })

    return {
      loading, errors,
      create, duplicate, update, deleteGroup, toggleStatus,
      createCompositeRoute, updateCompositeRoute, deleteCompositeRoute,
      updateSortOrder, clearGroupRateMultipliers, batchSetGroupRateMultipliers,
      batchSetGroupRPMOverrides, clearGroupRPMOverrides,
    }
  })
}

export const useAdminGroupsActionStore = createAdminGroupsActionStore()
