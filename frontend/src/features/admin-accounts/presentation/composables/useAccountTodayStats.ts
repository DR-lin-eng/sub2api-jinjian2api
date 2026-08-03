import { ref } from 'vue'
import { getBatchTodayStats } from '@/features/admin-accounts/data/datasources/adminAccountQueries'
import type { Account, WindowStats } from '@/types'

interface AccountTodayStatsOptions {
  getAccounts: () => Account[]
  shouldSkip: () => boolean
}

const buildDefaultTodayStats = (): WindowStats => ({
  requests: 0,
  tokens: 0,
  cost: 0,
  standard_cost: 0,
  user_cost: 0
})

export function useAccountTodayStats(options: AccountTodayStatsOptions) {
  const todayStatsByAccountId = ref<Record<string, WindowStats>>({})
  const todayStatsLoading = ref(false)
  const todayStatsError = ref<string | null>(null)
  const todayStatsReqSeq = ref(0)
  const pendingTodayStatsRefresh = ref(false)

  const refreshTodayStatsBatch = async () => {
    if (options.shouldSkip()) {
      todayStatsLoading.value = false
      todayStatsError.value = null
      return
    }

    const accountIDs = options.getAccounts().map(account => account.id)
    const reqSeq = ++todayStatsReqSeq.value
    if (accountIDs.length === 0) {
      todayStatsByAccountId.value = {}
      todayStatsError.value = null
      todayStatsLoading.value = false
      return
    }

    todayStatsLoading.value = true
    todayStatsError.value = null
    try {
      const result = await getBatchTodayStats(accountIDs)
      if (reqSeq !== todayStatsReqSeq.value) return
      const serverStats = result.stats ?? {}
      const nextStats: Record<string, WindowStats> = {}
      for (const accountID of accountIDs) {
        const key = String(accountID)
        nextStats[key] = serverStats[key] ?? buildDefaultTodayStats()
      }
      todayStatsByAccountId.value = nextStats
    } catch (error) {
      if (reqSeq !== todayStatsReqSeq.value) return
      todayStatsError.value = 'Failed'
      console.error('Failed to load account today stats:', error)
    } finally {
      if (reqSeq === todayStatsReqSeq.value) todayStatsLoading.value = false
    }
  }

  return {
    todayStatsByAccountId,
    todayStatsLoading,
    todayStatsError,
    pendingTodayStatsRefresh,
    refreshTodayStatsBatch
  }
}
