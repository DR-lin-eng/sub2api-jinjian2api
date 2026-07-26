import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'
import { usageQueryRepository } from '@/features/usage/data/repositories/usageQueryRepositoryImpl'
import { profileQueryRepository } from '@/features/profile/data/repositories/profileQueryRepositoryImpl'
import { useKeysQueryStore } from '@/features/keys/presentation/stores/keysQueryStore'
import { formatDateLocalInput } from '@/core/utils/format'
import { mapWithConcurrency } from '@/features/dashboard-user/presentation/utils/mapWithConcurrency'
import type { UserDashboardStats } from '@/features/usage/domain/models/userDashboardStats'
import type { TrendDataPoint } from '@/features/admin-dashboard/domain/models/trendDataPoint'
import type { ModelStat } from '@/features/admin-dashboard/domain/models/modelStat'
import type { UsageLog } from '@/core/models/domain/usageLog'
import type { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'
import type { ApiKey } from '@/core/models/domain/apiKey'
import type { BatchApiKeyUsageStats } from '@/features/usage/domain/models/batchApiKeyUsageStats'

export interface ApiKeyUsageRow {
  id: number
  name: string
  totalTokens: number
  actualSpend: number
}

const CONCURRENCY = 4

export function createDashboardUserQueryStore() {
  return defineStore('dashboard-user/query', () => {
    const loading = reactive<Record<string, boolean>>({
      stats: false,
      charts: false,
      recent: false,
      platformQuotas: false,
      apiKeyUsage: false,
    })
    const errors = reactive<Record<string, unknown>>({
      stats: null,
      charts: null,
      recent: null,
      platformQuotas: null,
      apiKeyUsage: null,
    })

    const stats = ref<UserDashboardStats | null>(null)
    const trendData = ref<TrendDataPoint[]>([])
    const modelStats = ref<ModelStat[]>([])
    const recentUsage = ref<UsageLog[]>([])
    const platformQuotas = ref<PlatformQuotaItem[] | null>(null)
    const apiKeyUsageRows = ref<ApiKeyUsageRow[]>([])
    const apiKeyUsageError = ref(false)

    const startDate = ref(formatDateLocalInput(new Date(Date.now() - 6 * 86400000)))
    const endDate = ref(formatDateLocalInput(new Date()))
    const granularity = ref<'day' | 'hour'>('day')

    let apiKeyUsageGeneration = 0

    async function loadStats() {
      loading.stats = true
      errors.stats = null
      try {
        const authStore = useAuthStore()
        await authStore.refreshUser()
        stats.value = await usageQueryRepository.getDashboardStats()
      } catch (e) {
        errors.stats = e
        throw e
      } finally {
        loading.stats = false
      }
    }

    async function loadCharts() {
      loading.charts = true
      errors.charts = null
      try {
        const [trendRes, modelsRes] = await Promise.all([
          usageQueryRepository.getDashboardTrend({
            start_date: startDate.value,
            end_date: endDate.value,
            granularity: granularity.value,
          }),
          usageQueryRepository.getDashboardModels({
            start_date: startDate.value,
            end_date: endDate.value,
          }),
        ])
        trendData.value = trendRes.trend ?? []
        modelStats.value = modelsRes.models ?? []
      } catch (e) {
        errors.charts = e
        throw e
      } finally {
        loading.charts = false
      }
    }

    async function loadRecent() {
      loading.recent = true
      errors.recent = null
      try {
        const res = await usageQueryRepository.getByDateRange(startDate.value, endDate.value)
        recentUsage.value = res.items.slice(0, 5)
      } catch (e) {
        errors.recent = e
        throw e
      } finally {
        loading.recent = false
      }
    }

    async function loadPlatformQuotas() {
      loading.platformQuotas = true
      errors.platformQuotas = null
      try {
        const data = await profileQueryRepository.getMyPlatformQuotas()
        platformQuotas.value = data.platform_quotas ?? []
      } catch (e) {
        errors.platformQuotas = e
        platformQuotas.value = []
      } finally {
        loading.platformQuotas = false
      }
    }

    async function loadApiKeyUsage() {
      const generation = ++apiKeyUsageGeneration
      const range = { startDate: startDate.value, endDate: endDate.value }
      const keysQuery = useKeysQueryStore()
      loading.apiKeyUsage = true
      apiKeyUsageError.value = false
      errors.apiKeyUsage = null
      try {
        const firstPage = await keysQuery.list(1, 100)
        const remainingPages = Array.from(
          { length: Math.max(0, firstPage.pages - 1) },
          (_, i) => i + 2,
        )
        const pageResponses = await mapWithConcurrency(
          remainingPages,
          CONCURRENCY,
          page => keysQuery.list(page, 100),
        )
        const keys: ApiKey[] = [firstPage, ...pageResponses].flatMap(r => r.items)
        if (generation !== apiKeyUsageGeneration) return

        const statsMap = new Map<number, BatchApiKeyUsageStats>()
        const idBatches = Array.from(
          { length: Math.ceil(keys.length / 100) },
          (_, i) => keys.slice(i * 100, i * 100 + 100).map(k => k.id),
        )
        const usageResponses = await mapWithConcurrency(
          idBatches,
          CONCURRENCY,
          ids => usageQueryRepository.getDashboardApiKeysUsage({
            api_key_ids: ids,
            start_date: range.startDate,
            end_date: range.endDate,
          }),
        )
        for (const res of usageResponses) {
          Object.values(res.stats).forEach(item => statsMap.set(item.apiKeyId, item))
        }
        if (generation !== apiKeyUsageGeneration) return

        apiKeyUsageRows.value = keys.map(k => ({
          id: k.id,
          name: k.name,
          totalTokens: statsMap.get(k.id)?.totalTokens ?? 0,
          actualSpend: statsMap.get(k.id)?.totalActualCost ?? 0,
        }))
      } catch (e) {
        errors.apiKeyUsage = e
        if (generation === apiKeyUsageGeneration) apiKeyUsageError.value = true
      } finally {
        if (generation === apiKeyUsageGeneration) loading.apiKeyUsage = false
      }
    }

    function loadRangeData() {
      void loadCharts()
      void loadApiKeyUsage()
    }

    function refreshAll() {
      void loadStats()
      void loadCharts()
      void loadRecent()
      void loadApiKeyUsage()
      void loadPlatformQuotas()
    }

    return {
      loading,
      errors,
      stats,
      trendData,
      modelStats,
      recentUsage,
      platformQuotas,
      apiKeyUsageRows,
      apiKeyUsageError,
      startDate,
      endDate,
      granularity,
      loadStats,
      loadCharts,
      loadRecent,
      loadPlatformQuotas,
      loadApiKeyUsage,
      loadRangeData,
      refreshAll,
    }
  })
}

export const useDashboardUserQueryStore = createDashboardUserQueryStore()
