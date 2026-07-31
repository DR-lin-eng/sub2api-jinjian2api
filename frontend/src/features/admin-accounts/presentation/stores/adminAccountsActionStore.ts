import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminAccountsActionRepository } from '@/features/admin-accounts/domain/repositories/adminAccountsActionRepository'
import type { AntigravityActionRepository } from '@/features/admin-accounts/domain/repositories/antigravityActionRepository'
import type { GeminiActionRepository } from '@/features/admin-accounts/domain/repositories/geminiActionRepository'
import type { GrokActionRepository } from '@/features/admin-accounts/domain/repositories/grokActionRepository'
import type { ScheduledTestsActionRepository } from '@/features/admin-accounts/domain/repositories/scheduledTestsActionRepository'
import { adminAccountsActionRepository } from '@/features/admin-accounts/data/repositories/adminAccountsActionRepositoryImpl'
import { antigravityActionRepository } from '@/features/admin-accounts/data/repositories/antigravityActionRepositoryImpl'
import { geminiActionRepository } from '@/features/admin-accounts/data/repositories/geminiActionRepositoryImpl'
import { grokActionRepository } from '@/features/admin-accounts/data/repositories/grokActionRepositoryImpl'
import { scheduledTestsActionRepository } from '@/features/admin-accounts/data/repositories/scheduledTestsActionRepositoryImpl'

export function createAdminAccountsActionStore(
  adminAccountsRepo: AdminAccountsActionRepository = adminAccountsActionRepository,
  antigravityRepo: AntigravityActionRepository = antigravityActionRepository,
  geminiRepo: GeminiActionRepository = geminiActionRepository,
  grokRepo: GrokActionRepository = grokActionRepository,
  scheduledTestsRepo: ScheduledTestsActionRepository = scheduledTestsActionRepository
) {
  return defineStore('adminAccounts/action', () => {
    const loading = reactive<Record<string, boolean>>({})
    const errors = reactive<Record<string, unknown>>({})

    function track<F extends (...args: never[]) => Promise<unknown>>(task: string, fn: F): F {
      return ((...args: Parameters<F>) => {
        loading[task] = true
        errors[task] = null
        return Promise.resolve()
          .then(() => fn(...args))
          .catch((error: unknown) => { errors[task] = error; throw error })
          .finally(() => { loading[task] = false })
      }) as F
    }

    // adminAccounts action methods
    const create = track('create', adminAccountsRepo.create)
    const duplicate = track('duplicate', adminAccountsRepo.duplicate)
    const update = track('update', adminAccountsRepo.update)
    const getBatchSummaries = track('getBatchSummaries', adminAccountsRepo.getBatchSummaries)
    const checkMixedChannelRisk = track('checkMixedChannelRisk', adminAccountsRepo.checkMixedChannelRisk)
    const deleteAccount = track('deleteAccount', adminAccountsRepo.deleteAccount)
    const toggleStatus = track('toggleStatus', adminAccountsRepo.toggleStatus)
    const testAccount = track('testAccount', adminAccountsRepo.testAccount)
    const refreshCredentials = track('refreshCredentials', adminAccountsRepo.refreshCredentials)
    const applyOAuthCredentials = track('applyOAuthCredentials', adminAccountsRepo.applyOAuthCredentials)
    const clearError = track('clearError', adminAccountsRepo.clearError)
    const clearRateLimit = track('clearRateLimit', adminAccountsRepo.clearRateLimit)
    const recoverState = track('recoverState', adminAccountsRepo.recoverState)
    const resetAccountQuota = track('resetAccountQuota', adminAccountsRepo.resetAccountQuota)
    const resetTempUnschedulable = track('resetTempUnschedulable', adminAccountsRepo.resetTempUnschedulable)
    const generateAuthUrl = track('generateAuthUrl', adminAccountsRepo.generateAuthUrl)
    const exchangeCode = track('exchangeCode', adminAccountsRepo.exchangeCode)
    const batchCreate = track('batchCreate', adminAccountsRepo.batchCreate)
    const batchUpdateCredentials = track('batchUpdateCredentials', adminAccountsRepo.batchUpdateCredentials)
    const bulkUpdate = track('bulkUpdate', adminAccountsRepo.bulkUpdate)
    const getBatchTodayStats = track('getBatchTodayStats', adminAccountsRepo.getBatchTodayStats)
    const setSchedulable = track('setSchedulable', adminAccountsRepo.setSchedulable)
    const syncUpstreamModels = track('syncUpstreamModels', adminAccountsRepo.syncUpstreamModels)
    const syncUpstreamModelsPreview = track('syncUpstreamModelsPreview', adminAccountsRepo.syncUpstreamModelsPreview)
    const previewFromCrs = track('previewFromCrs', adminAccountsRepo.previewFromCrs)
    const syncFromCrs = track('syncFromCrs', adminAccountsRepo.syncFromCrs)
    const importData = track('importData', adminAccountsRepo.importData)
    const importCodexSession = track('importCodexSession', adminAccountsRepo.importCodexSession)
    const createOpenAICodexPAT = track('createOpenAICodexPAT', adminAccountsRepo.createOpenAICodexPAT)
    const refreshOpenAIToken = track('refreshOpenAIToken', adminAccountsRepo.refreshOpenAIToken)
    const revertProxyFallback = track('revertProxyFallback', adminAccountsRepo.revertProxyFallback)
    const batchClearError = track('batchClearError', adminAccountsRepo.batchClearError)
    const batchRefresh = track('batchRefresh', adminAccountsRepo.batchRefresh)
    const setPrivacy = track('setPrivacy', adminAccountsRepo.setPrivacy)
    const resetOpenAIQuota = track('resetOpenAIQuota', adminAccountsRepo.resetOpenAIQuota)
    const createSparkShadow = track('createSparkShadow', adminAccountsRepo.createSparkShadow)
    const updateUpstreamBillingProbeSettings = track('updateUpstreamBillingProbeSettings', adminAccountsRepo.updateUpstreamBillingProbeSettings)
    const setUpstreamBillingProbeEnabled = track('setUpstreamBillingProbeEnabled', adminAccountsRepo.setUpstreamBillingProbeEnabled)
    const probeUpstreamBilling = track('probeUpstreamBilling', adminAccountsRepo.probeUpstreamBilling)
    const probeUpstreamBillingBatch = track('probeUpstreamBillingBatch', adminAccountsRepo.probeUpstreamBillingBatch)

    // antigravity action methods
    const antigravity_generateAuthUrl = track('antigravity_generateAuthUrl', antigravityRepo.generateAuthUrl)
    const antigravity_exchangeCode = track('antigravity_exchangeCode', antigravityRepo.exchangeCode)
    const refreshAntigravityToken = track('refreshAntigravityToken', antigravityRepo.refreshAntigravityToken)

    // gemini action methods
    const gemini_generateAuthUrl = track('gemini_generateAuthUrl', geminiRepo.generateAuthUrl)
    const gemini_exchangeCode = track('gemini_exchangeCode', geminiRepo.exchangeCode)

    // grok action methods
    const grok_generateAuthUrl = track('grok_generateAuthUrl', grokRepo.generateAuthUrl)
    const grok_exchangeCode = track('grok_exchangeCode', grokRepo.exchangeCode)
    const refreshGrokToken = track('refreshGrokToken', grokRepo.refreshGrokToken)
    const resetQuota = track('resetQuota', grokRepo.resetQuota)
    const createFromSSO = track('createFromSSO', grokRepo.createFromSSO)

    // scheduledTests action methods
    const scheduledTests_create = track('scheduledTests_create', scheduledTestsRepo.create)
    const scheduledTests_update = track('scheduledTests_update', scheduledTestsRepo.update)
    const deletePlan = track('deletePlan', scheduledTestsRepo.deletePlan)

    return {
      loading, errors,
      create, duplicate, update, getBatchSummaries, checkMixedChannelRisk, deleteAccount, toggleStatus, testAccount,
      refreshCredentials, applyOAuthCredentials, clearError, clearRateLimit, recoverState, resetAccountQuota,
      resetTempUnschedulable, generateAuthUrl, exchangeCode, batchCreate, batchUpdateCredentials, bulkUpdate,
      getBatchTodayStats, setSchedulable, syncUpstreamModels, syncUpstreamModelsPreview, previewFromCrs, syncFromCrs,
      importData, importCodexSession, createOpenAICodexPAT, refreshOpenAIToken, revertProxyFallback, batchClearError,
      batchRefresh, setPrivacy, resetOpenAIQuota, createSparkShadow, updateUpstreamBillingProbeSettings,
      setUpstreamBillingProbeEnabled, probeUpstreamBilling, probeUpstreamBillingBatch,
      antigravity_generateAuthUrl, antigravity_exchangeCode, refreshAntigravityToken,
      gemini_generateAuthUrl, gemini_exchangeCode,
      grok_generateAuthUrl, grok_exchangeCode, refreshGrokToken, resetQuota, createFromSSO,
      scheduledTests_create, scheduledTests_update, deletePlan,
    }
  })
}

export const useAdminAccountsActionStore = createAdminAccountsActionStore()
