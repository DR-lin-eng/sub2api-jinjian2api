/**
 * AdminAccountsRepository (interface). Auto-generated from adminAccountsDatasource.ts.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'

export type AdminAccountsRepository = {
  readonly list: typeof ds.list
  readonly listWithEtag: typeof ds.listWithEtag
  readonly getById: typeof ds.getById
  readonly getBatchSummaries: typeof ds.getBatchSummaries
  readonly create: typeof ds.create
  readonly duplicate: typeof ds.duplicate
  readonly update: typeof ds.update
  readonly checkMixedChannelRisk: typeof ds.checkMixedChannelRisk
  readonly deleteAccount: typeof ds.deleteAccount
  readonly toggleStatus: typeof ds.toggleStatus
  readonly testAccount: typeof ds.testAccount
  readonly refreshCredentials: typeof ds.refreshCredentials
  readonly applyOAuthCredentials: typeof ds.applyOAuthCredentials
  readonly getStats: typeof ds.getStats
  readonly clearError: typeof ds.clearError
  readonly getUsage: typeof ds.getUsage
  readonly clearRateLimit: typeof ds.clearRateLimit
  readonly recoverState: typeof ds.recoverState
  readonly resetAccountQuota: typeof ds.resetAccountQuota
  readonly getTempUnschedulableStatus: typeof ds.getTempUnschedulableStatus
  readonly resetTempUnschedulable: typeof ds.resetTempUnschedulable
  readonly generateAuthUrl: typeof ds.generateAuthUrl
  readonly exchangeCode: typeof ds.exchangeCode
  readonly batchCreate: typeof ds.batchCreate
  readonly batchUpdateCredentials: typeof ds.batchUpdateCredentials
  readonly bulkUpdate: typeof ds.bulkUpdate
  readonly getTodayStats: typeof ds.getTodayStats
  readonly getBatchTodayStats: typeof ds.getBatchTodayStats
  readonly setSchedulable: typeof ds.setSchedulable
  readonly getAvailableModels: typeof ds.getAvailableModels
  readonly syncUpstreamModels: typeof ds.syncUpstreamModels
  readonly syncUpstreamModelsPreview: typeof ds.syncUpstreamModelsPreview
  readonly previewFromCrs: typeof ds.previewFromCrs
  readonly syncFromCrs: typeof ds.syncFromCrs
  readonly exportData: typeof ds.exportData
  readonly importData: typeof ds.importData
  readonly importCodexSession: typeof ds.importCodexSession
  readonly createOpenAICodexPAT: typeof ds.createOpenAICodexPAT
  readonly getAntigravityDefaultModelMapping: typeof ds.getAntigravityDefaultModelMapping
  readonly refreshOpenAIToken: typeof ds.refreshOpenAIToken
  readonly revertProxyFallback: typeof ds.revertProxyFallback
  readonly batchClearError: typeof ds.batchClearError
  readonly batchRefresh: typeof ds.batchRefresh
  readonly setPrivacy: typeof ds.setPrivacy
  readonly queryOpenAIQuota: typeof ds.queryOpenAIQuota
  readonly resetOpenAIQuota: typeof ds.resetOpenAIQuota
  readonly createSparkShadow: typeof ds.createSparkShadow
  readonly getUpstreamBillingProbeSettings: typeof ds.getUpstreamBillingProbeSettings
  readonly updateUpstreamBillingProbeSettings: typeof ds.updateUpstreamBillingProbeSettings
  readonly setUpstreamBillingProbeEnabled: typeof ds.setUpstreamBillingProbeEnabled
  readonly probeUpstreamBilling: typeof ds.probeUpstreamBilling
  readonly probeUpstreamBillingBatch: typeof ds.probeUpstreamBillingBatch
}
