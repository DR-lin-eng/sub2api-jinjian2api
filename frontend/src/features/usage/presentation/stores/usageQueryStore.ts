import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { UsageQueryRepository } from '@/features/usage/domain/repositories/usageQueryRepository'
import { usageQueryRepository as defaultRepo } from '@/features/usage/data/repositories/usageQueryRepositoryImpl'

export function createUsageQueryStore(repo: UsageQueryRepository = defaultRepo) {
  return defineStore('usage/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false, query: false, getStats: false, getStatsByDateRange: false,
      getByDateRange: false, getById: false, getDashboardStats: false,
      getDashboardTrend: false, getDashboardModels: false, getMyApiKeyDailyUsage: false,
      getDashboardSnapshotV2: false, getDashboardApiKeysUsage: false,
      listMyErrorRequests: false, getMyErrorDetail: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null, query: null, getStats: null, getStatsByDateRange: null,
      getByDateRange: null, getById: null, getDashboardStats: null,
      getDashboardTrend: null, getDashboardModels: null, getMyApiKeyDailyUsage: null,
      getDashboardSnapshotV2: null, getDashboardApiKeysUsage: null,
      listMyErrorRequests: null, getMyErrorDetail: null,
    })

    function wrap<F extends (...args: never[]) => Promise<unknown>>(key: string, fn: F): F {
      return ((...args: Parameters<F>) => {
        loading[key] = true
        errors[key] = null
        return fn(...args)
          .catch((e: unknown) => { errors[key] = e; throw e })
          .finally(() => { loading[key] = false })
      }) as F
    }

    const list = wrap('list', repo.list.bind(repo) as UsageQueryRepository['list'])
    const query = wrap('query', repo.query.bind(repo) as UsageQueryRepository['query'])
    const getStats = wrap('getStats', repo.getStats.bind(repo) as UsageQueryRepository['getStats'])
    const getStatsByDateRange = wrap('getStatsByDateRange', repo.getStatsByDateRange.bind(repo) as UsageQueryRepository['getStatsByDateRange'])
    const getByDateRange = wrap('getByDateRange', repo.getByDateRange.bind(repo) as UsageQueryRepository['getByDateRange'])
    const getById = wrap('getById', repo.getById.bind(repo) as UsageQueryRepository['getById'])
    const getDashboardStats = wrap('getDashboardStats', repo.getDashboardStats.bind(repo) as UsageQueryRepository['getDashboardStats'])
    const getDashboardTrend = wrap('getDashboardTrend', repo.getDashboardTrend.bind(repo) as UsageQueryRepository['getDashboardTrend'])
    const getDashboardModels = wrap('getDashboardModels', repo.getDashboardModels.bind(repo) as UsageQueryRepository['getDashboardModels'])
    const getMyApiKeyDailyUsage = wrap('getMyApiKeyDailyUsage', repo.getMyApiKeyDailyUsage.bind(repo) as UsageQueryRepository['getMyApiKeyDailyUsage'])
    const getDashboardSnapshotV2 = wrap('getDashboardSnapshotV2', repo.getDashboardSnapshotV2.bind(repo) as UsageQueryRepository['getDashboardSnapshotV2'])
    const getDashboardApiKeysUsage = wrap('getDashboardApiKeysUsage', repo.getDashboardApiKeysUsage.bind(repo) as UsageQueryRepository['getDashboardApiKeysUsage'])
    const listMyErrorRequests = wrap('listMyErrorRequests', repo.listMyErrorRequests.bind(repo) as UsageQueryRepository['listMyErrorRequests'])
    const getMyErrorDetail = wrap('getMyErrorDetail', repo.getMyErrorDetail.bind(repo) as UsageQueryRepository['getMyErrorDetail'])

    return {
      loading, errors,
      list, query, getStats, getStatsByDateRange, getByDateRange, getById,
      getDashboardStats, getDashboardTrend, getDashboardModels, getMyApiKeyDailyUsage,
      getDashboardSnapshotV2, getDashboardApiKeysUsage, listMyErrorRequests, getMyErrorDetail,
    }
  })
}

export const useUsageQueryStore = createUsageQueryStore()
