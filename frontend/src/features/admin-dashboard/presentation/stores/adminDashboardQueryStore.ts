import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminDashboardQueryRepository } from '@/features/admin-dashboard/domain/repositories/adminDashboardQueryRepository'
import { adminDashboardQueryRepository as defaultRepo } from '@/features/admin-dashboard/data/repositories/adminDashboardQueryRepositoryImpl'

export function createAdminDashboardQueryStore(repo: AdminDashboardQueryRepository = defaultRepo) {
  return defineStore('adminDashboard/query', () => {
    const loading = reactive<Record<string, boolean>>({
      getStats: false,
      getRealtimeMetrics: false,
      getUsageTrend: false,
      getModelStats: false,
      getGroupStats: false,
      getUserBreakdown: false,
      getSnapshotV2: false,
      getApiKeyUsageTrend: false,
      getUserUsageTrend: false,
      getUserSpendingRanking: false,
      getBatchUsersUsage: false,
      getBatchApiKeysUsage: false,
    })
    const errors = reactive<Record<string, unknown>>({
      getStats: null,
      getRealtimeMetrics: null,
      getUsageTrend: null,
      getModelStats: null,
      getGroupStats: null,
      getUserBreakdown: null,
      getSnapshotV2: null,
      getApiKeyUsageTrend: null,
      getUserUsageTrend: null,
      getUserSpendingRanking: null,
      getBatchUsersUsage: null,
      getBatchApiKeysUsage: null,
    })

    const getStats: AdminDashboardQueryRepository['getStats'] = (...args) => {
      loading.getStats = true
      errors.getStats = null
      return repo.getStats(...args)
        .catch((e: unknown) => { errors.getStats = e; throw e })
        .finally(() => { loading.getStats = false })
    }

    const getRealtimeMetrics: AdminDashboardQueryRepository['getRealtimeMetrics'] = (...args) => {
      loading.getRealtimeMetrics = true
      errors.getRealtimeMetrics = null
      return repo.getRealtimeMetrics(...args)
        .catch((e: unknown) => { errors.getRealtimeMetrics = e; throw e })
        .finally(() => { loading.getRealtimeMetrics = false })
    }

    const getUsageTrend: AdminDashboardQueryRepository['getUsageTrend'] = (...args) => {
      loading.getUsageTrend = true
      errors.getUsageTrend = null
      return repo.getUsageTrend(...args)
        .catch((e: unknown) => { errors.getUsageTrend = e; throw e })
        .finally(() => { loading.getUsageTrend = false })
    }

    const getModelStats: AdminDashboardQueryRepository['getModelStats'] = (...args) => {
      loading.getModelStats = true
      errors.getModelStats = null
      return repo.getModelStats(...args)
        .catch((e: unknown) => { errors.getModelStats = e; throw e })
        .finally(() => { loading.getModelStats = false })
    }

    const getGroupStats: AdminDashboardQueryRepository['getGroupStats'] = (...args) => {
      loading.getGroupStats = true
      errors.getGroupStats = null
      return repo.getGroupStats(...args)
        .catch((e: unknown) => { errors.getGroupStats = e; throw e })
        .finally(() => { loading.getGroupStats = false })
    }

    const getUserBreakdown: AdminDashboardQueryRepository['getUserBreakdown'] = (...args) => {
      loading.getUserBreakdown = true
      errors.getUserBreakdown = null
      return repo.getUserBreakdown(...args)
        .catch((e: unknown) => { errors.getUserBreakdown = e; throw e })
        .finally(() => { loading.getUserBreakdown = false })
    }

    const getSnapshotV2: AdminDashboardQueryRepository['getSnapshotV2'] = (...args) => {
      loading.getSnapshotV2 = true
      errors.getSnapshotV2 = null
      return repo.getSnapshotV2(...args)
        .catch((e: unknown) => { errors.getSnapshotV2 = e; throw e })
        .finally(() => { loading.getSnapshotV2 = false })
    }

    const getApiKeyUsageTrend: AdminDashboardQueryRepository['getApiKeyUsageTrend'] = (...args) => {
      loading.getApiKeyUsageTrend = true
      errors.getApiKeyUsageTrend = null
      return repo.getApiKeyUsageTrend(...args)
        .catch((e: unknown) => { errors.getApiKeyUsageTrend = e; throw e })
        .finally(() => { loading.getApiKeyUsageTrend = false })
    }

    const getUserUsageTrend: AdminDashboardQueryRepository['getUserUsageTrend'] = (...args) => {
      loading.getUserUsageTrend = true
      errors.getUserUsageTrend = null
      return repo.getUserUsageTrend(...args)
        .catch((e: unknown) => { errors.getUserUsageTrend = e; throw e })
        .finally(() => { loading.getUserUsageTrend = false })
    }

    const getUserSpendingRanking: AdminDashboardQueryRepository['getUserSpendingRanking'] = (...args) => {
      loading.getUserSpendingRanking = true
      errors.getUserSpendingRanking = null
      return repo.getUserSpendingRanking(...args)
        .catch((e: unknown) => { errors.getUserSpendingRanking = e; throw e })
        .finally(() => { loading.getUserSpendingRanking = false })
    }

    const getBatchUsersUsage: AdminDashboardQueryRepository['getBatchUsersUsage'] = (...args) => {
      loading.getBatchUsersUsage = true
      errors.getBatchUsersUsage = null
      return repo.getBatchUsersUsage(...args)
        .catch((e: unknown) => { errors.getBatchUsersUsage = e; throw e })
        .finally(() => { loading.getBatchUsersUsage = false })
    }

    const getBatchApiKeysUsage: AdminDashboardQueryRepository['getBatchApiKeysUsage'] = (...args) => {
      loading.getBatchApiKeysUsage = true
      errors.getBatchApiKeysUsage = null
      return repo.getBatchApiKeysUsage(...args)
        .catch((e: unknown) => { errors.getBatchApiKeysUsage = e; throw e })
        .finally(() => { loading.getBatchApiKeysUsage = false })
    }

    return {
      loading, errors,
      getStats, getRealtimeMetrics, getUsageTrend, getModelStats, getGroupStats,
      getUserBreakdown, getSnapshotV2, getApiKeyUsageTrend, getUserUsageTrend,
      getUserSpendingRanking, getBatchUsersUsage, getBatchApiKeysUsage,
    }
  })
}

export const useAdminDashboardQueryStore = createAdminDashboardQueryStore()
