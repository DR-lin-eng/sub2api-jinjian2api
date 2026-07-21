/**
 * AdminAccountsRepository (interface). Auto-generated from adminAccountsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminAccountsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'

export type AdminAccountsRepository = {
  list: typeof ds.list
  listWithEtag: typeof ds.listWithEtag
  getById: typeof ds.getById
  getBatchSummaries: typeof ds.getBatchSummaries
  create: typeof ds.create
  duplicate: typeof ds.duplicate
  update: typeof ds.update
  checkMixedChannelRisk: typeof ds.checkMixedChannelRisk
  deleteAccount: typeof ds.deleteAccount
  toggleStatus: typeof ds.toggleStatus
  testAccount: typeof ds.testAccount
  refreshCredentials: typeof ds.refreshCredentials
  applyOAuthCredentials: typeof ds.applyOAuthCredentials
  getStats: typeof ds.getStats
  clearError: typeof ds.clearError
  getUsage: typeof ds.getUsage
  clearRateLimit: typeof ds.clearRateLimit
  recoverState: typeof ds.recoverState
  resetAccountQuota: typeof ds.resetAccountQuota
  getTempUnschedulableStatus: typeof ds.getTempUnschedulableStatus
  resetTempUnschedulable: typeof ds.resetTempUnschedulable
  generateAuthUrl: typeof ds.generateAuthUrl
  exchangeCode: typeof ds.exchangeCode
  batchCreate: typeof ds.batchCreate
  batchUpdateCredentials: typeof ds.batchUpdateCredentials
  bulkUpdate: typeof ds.bulkUpdate
  getTodayStats: typeof ds.getTodayStats
  getBatchTodayStats: typeof ds.getBatchTodayStats
  setSchedulable: typeof ds.setSchedulable
  getAvailableModels: typeof ds.getAvailableModels
  syncUpstreamModels: typeof ds.syncUpstreamModels
  syncUpstreamModelsPreview: typeof ds.syncUpstreamModelsPreview
  previewFromCrs: typeof ds.previewFromCrs
  syncFromCrs: typeof ds.syncFromCrs
  exportData: typeof ds.exportData
  importData: typeof ds.importData
  importCodexSession: typeof ds.importCodexSession
  createOpenAICodexPAT: typeof ds.createOpenAICodexPAT
  getAntigravityDefaultModelMapping: typeof ds.getAntigravityDefaultModelMapping
  refreshOpenAIToken: typeof ds.refreshOpenAIToken
  revertProxyFallback: typeof ds.revertProxyFallback
  batchClearError: typeof ds.batchClearError
  batchRefresh: typeof ds.batchRefresh
  setPrivacy: typeof ds.setPrivacy
  queryOpenAIQuota: typeof ds.queryOpenAIQuota
  resetOpenAIQuota: typeof ds.resetOpenAIQuota
  createSparkShadow: typeof ds.createSparkShadow
  getUpstreamBillingProbeSettings: typeof ds.getUpstreamBillingProbeSettings
  updateUpstreamBillingProbeSettings: typeof ds.updateUpstreamBillingProbeSettings
  setUpstreamBillingProbeEnabled: typeof ds.setUpstreamBillingProbeEnabled
  probeUpstreamBilling: typeof ds.probeUpstreamBilling
  probeUpstreamBillingBatch: typeof ds.probeUpstreamBillingBatch
}
