import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminAccountsQueryRepository } from '@/features/admin-accounts/domain/repositories/adminAccountsQueryRepository'
import type { GeminiQueryRepository } from '@/features/admin-accounts/domain/repositories/geminiQueryRepository'
import type { GrokQueryRepository } from '@/features/admin-accounts/domain/repositories/grokQueryRepository'
import type { ScheduledTestsQueryRepository } from '@/features/admin-accounts/domain/repositories/scheduledTestsQueryRepository'
import { adminAccountsQueryRepository } from '@/features/admin-accounts/data/repositories/adminAccountsQueryRepositoryImpl'
import { geminiQueryRepository } from '@/features/admin-accounts/data/repositories/geminiQueryRepositoryImpl'
import { grokQueryRepository } from '@/features/admin-accounts/data/repositories/grokQueryRepositoryImpl'
import { scheduledTestsQueryRepository } from '@/features/admin-accounts/data/repositories/scheduledTestsQueryRepositoryImpl'

export function createAdminAccountsQueryStore(
  adminAccountsRepo: AdminAccountsQueryRepository = adminAccountsQueryRepository,
  geminiRepo: GeminiQueryRepository = geminiQueryRepository,
  grokRepo: GrokQueryRepository = grokQueryRepository,
  scheduledTestsRepo: ScheduledTestsQueryRepository = scheduledTestsQueryRepository
) {
  return defineStore('adminAccounts/query', () => {
    const loading = reactive<Record<string, boolean>>({})
    const errors = reactive<Record<string, unknown>>({})

    function track<Args extends unknown[], R>(task: string, fn: (...args: Args) => Promise<R>): (...args: Args) => Promise<R> {
      return (...args: Args) => {
        loading[task] = true
        errors[task] = null
        return Promise.resolve()
          .then(() => fn(...args))
          .catch((error: unknown) => { errors[task] = error; throw error })
          .finally(() => { loading[task] = false })
      }
    }

    // adminAccounts query methods
    const list = track('list', adminAccountsRepo.list)
    const listWithEtag = track('listWithEtag', adminAccountsRepo.listWithEtag)
    const getById = track('getById', adminAccountsRepo.getById)
    const getStats = track('getStats', adminAccountsRepo.getStats)
    const getUsage = track('getUsage', adminAccountsRepo.getUsage)
    const getTempUnschedulableStatus = track('getTempUnschedulableStatus', adminAccountsRepo.getTempUnschedulableStatus)
    const getTodayStats = track('getTodayStats', adminAccountsRepo.getTodayStats)
    const getAvailableModels = track('getAvailableModels', adminAccountsRepo.getAvailableModels)
    const exportData = track('exportData', adminAccountsRepo.exportData)
    const getAntigravityDefaultModelMapping = track('getAntigravityDefaultModelMapping', adminAccountsRepo.getAntigravityDefaultModelMapping)
    const queryOpenAIQuota = track('queryOpenAIQuota', adminAccountsRepo.queryOpenAIQuota)
    const getUpstreamBillingProbeSettings = track('getUpstreamBillingProbeSettings', adminAccountsRepo.getUpstreamBillingProbeSettings)

    // gemini query methods
    const getCapabilities = track('getCapabilities', geminiRepo.getCapabilities)

    // grok query methods
    const queryQuota = track('queryQuota', grokRepo.queryQuota)

    // scheduledTests query methods
    const listByAccount = track('listByAccount', scheduledTestsRepo.listByAccount)
    const listResults = track('listResults', scheduledTestsRepo.listResults)

    return {
      loading, errors,
      list, listWithEtag, getById, getStats, getUsage, getTempUnschedulableStatus, getTodayStats,
      getAvailableModels, exportData, getAntigravityDefaultModelMapping, queryOpenAIQuota,
      getUpstreamBillingProbeSettings,
      getCapabilities,
      queryQuota,
      listByAccount, listResults,
    }
  })
}

export const useAdminAccountsQueryStore = createAdminAccountsQueryStore()
