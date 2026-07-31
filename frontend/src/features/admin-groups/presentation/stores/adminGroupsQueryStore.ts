import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminGroupsQueryRepository } from '@/features/admin-groups/domain/repositories/adminGroupsQueryRepository'
import { adminGroupsQueryRepository as defaultRepo } from '@/features/admin-groups/data/repositories/adminGroupsQueryRepositoryImpl'

export function createAdminGroupsQueryStore(repo: AdminGroupsQueryRepository = defaultRepo) {
  return defineStore('adminGroups/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false, getAll: false, getAllIncludingInactive: false, getByPlatform: false,
      getById: false, getModelsListCandidates: false, getStats: false, getGroupApiKeys: false,
      listCompositeRoutes: false, previewCompositeRoute: false, getGroupRateMultipliers: false,
      getGroupRPMOverrides: false, getUsageSummary: false, getCapacitySummary: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null, getAll: null, getAllIncludingInactive: null, getByPlatform: null,
      getById: null, getModelsListCandidates: null, getStats: null, getGroupApiKeys: null,
      listCompositeRoutes: null, previewCompositeRoute: null, getGroupRateMultipliers: null,
      getGroupRPMOverrides: null, getUsageSummary: null, getCapacitySummary: null,
    })

    const list: AdminGroupsQueryRepository['list'] = ((...args: Parameters<AdminGroupsQueryRepository['list']>) => {
      loading.list = true
      errors.list = null
      return repo.list(...args)
        .catch((error: unknown) => { errors.list = error; throw error })
        .finally(() => { loading.list = false })
    })

    const getAll: AdminGroupsQueryRepository['getAll'] = ((...args: Parameters<AdminGroupsQueryRepository['getAll']>) => {
      loading.getAll = true
      errors.getAll = null
      return repo.getAll(...args)
        .catch((error: unknown) => { errors.getAll = error; throw error })
        .finally(() => { loading.getAll = false })
    })

    const getAllIncludingInactive: AdminGroupsQueryRepository['getAllIncludingInactive'] = (() => {
      loading.getAllIncludingInactive = true
      errors.getAllIncludingInactive = null
      return repo.getAllIncludingInactive()
        .catch((error: unknown) => { errors.getAllIncludingInactive = error; throw error })
        .finally(() => { loading.getAllIncludingInactive = false })
    })

    const getByPlatform: AdminGroupsQueryRepository['getByPlatform'] = ((...args: Parameters<AdminGroupsQueryRepository['getByPlatform']>) => {
      loading.getByPlatform = true
      errors.getByPlatform = null
      return repo.getByPlatform(...args)
        .catch((error: unknown) => { errors.getByPlatform = error; throw error })
        .finally(() => { loading.getByPlatform = false })
    })

    const getById: AdminGroupsQueryRepository['getById'] = ((...args: Parameters<AdminGroupsQueryRepository['getById']>) => {
      loading.getById = true
      errors.getById = null
      return repo.getById(...args)
        .catch((error: unknown) => { errors.getById = error; throw error })
        .finally(() => { loading.getById = false })
    })

    const getModelsListCandidates: AdminGroupsQueryRepository['getModelsListCandidates'] = ((...args: Parameters<AdminGroupsQueryRepository['getModelsListCandidates']>) => {
      loading.getModelsListCandidates = true
      errors.getModelsListCandidates = null
      return repo.getModelsListCandidates(...args)
        .catch((error: unknown) => { errors.getModelsListCandidates = error; throw error })
        .finally(() => { loading.getModelsListCandidates = false })
    })

    const getStats: AdminGroupsQueryRepository['getStats'] = ((...args: Parameters<AdminGroupsQueryRepository['getStats']>) => {
      loading.getStats = true
      errors.getStats = null
      return repo.getStats(...args)
        .catch((error: unknown) => { errors.getStats = error; throw error })
        .finally(() => { loading.getStats = false })
    })

    const getGroupApiKeys: AdminGroupsQueryRepository['getGroupApiKeys'] = ((...args: Parameters<AdminGroupsQueryRepository['getGroupApiKeys']>) => {
      loading.getGroupApiKeys = true
      errors.getGroupApiKeys = null
      return repo.getGroupApiKeys(...args)
        .catch((error: unknown) => { errors.getGroupApiKeys = error; throw error })
        .finally(() => { loading.getGroupApiKeys = false })
    })

    const listCompositeRoutes: AdminGroupsQueryRepository['listCompositeRoutes'] = ((...args: Parameters<AdminGroupsQueryRepository['listCompositeRoutes']>) => {
      loading.listCompositeRoutes = true
      errors.listCompositeRoutes = null
      return repo.listCompositeRoutes(...args)
        .catch((error: unknown) => { errors.listCompositeRoutes = error; throw error })
        .finally(() => { loading.listCompositeRoutes = false })
    })

    const previewCompositeRoute: AdminGroupsQueryRepository['previewCompositeRoute'] = ((...args: Parameters<AdminGroupsQueryRepository['previewCompositeRoute']>) => {
      loading.previewCompositeRoute = true
      errors.previewCompositeRoute = null
      return repo.previewCompositeRoute(...args)
        .catch((error: unknown) => { errors.previewCompositeRoute = error; throw error })
        .finally(() => { loading.previewCompositeRoute = false })
    })

    const getGroupRateMultipliers: AdminGroupsQueryRepository['getGroupRateMultipliers'] = ((...args: Parameters<AdminGroupsQueryRepository['getGroupRateMultipliers']>) => {
      loading.getGroupRateMultipliers = true
      errors.getGroupRateMultipliers = null
      return repo.getGroupRateMultipliers(...args)
        .catch((error: unknown) => { errors.getGroupRateMultipliers = error; throw error })
        .finally(() => { loading.getGroupRateMultipliers = false })
    })

    const getGroupRPMOverrides: AdminGroupsQueryRepository['getGroupRPMOverrides'] = ((...args: Parameters<AdminGroupsQueryRepository['getGroupRPMOverrides']>) => {
      loading.getGroupRPMOverrides = true
      errors.getGroupRPMOverrides = null
      return repo.getGroupRPMOverrides(...args)
        .catch((error: unknown) => { errors.getGroupRPMOverrides = error; throw error })
        .finally(() => { loading.getGroupRPMOverrides = false })
    })

    const getUsageSummary: AdminGroupsQueryRepository['getUsageSummary'] = ((...args: Parameters<AdminGroupsQueryRepository['getUsageSummary']>) => {
      loading.getUsageSummary = true
      errors.getUsageSummary = null
      return repo.getUsageSummary(...args)
        .catch((error: unknown) => { errors.getUsageSummary = error; throw error })
        .finally(() => { loading.getUsageSummary = false })
    })

    const getCapacitySummary: AdminGroupsQueryRepository['getCapacitySummary'] = (() => {
      loading.getCapacitySummary = true
      errors.getCapacitySummary = null
      return repo.getCapacitySummary()
        .catch((error: unknown) => { errors.getCapacitySummary = error; throw error })
        .finally(() => { loading.getCapacitySummary = false })
    })

    return {
      loading, errors,
      list, getAll, getAllIncludingInactive, getByPlatform, getById,
      getModelsListCandidates, getStats, getGroupApiKeys, listCompositeRoutes,
      previewCompositeRoute, getGroupRateMultipliers, getGroupRPMOverrides,
      getUsageSummary, getCapacitySummary,
    }
  })
}

export const useAdminGroupsQueryStore = createAdminGroupsQueryStore()
