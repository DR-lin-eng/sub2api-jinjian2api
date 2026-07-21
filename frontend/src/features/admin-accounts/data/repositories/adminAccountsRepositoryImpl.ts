/**
 * AdminAccountsRepositoryImpl. Auto-generated from adminAccountsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'
import type { AdminAccountsRepository } from '@/features/admin-accounts/domain/repositories/adminAccountsRepository'

export class AdminAccountsRepositoryImpl implements AdminAccountsRepository {
  list = ds.list
  listWithEtag = ds.listWithEtag
  getById = ds.getById
  getBatchSummaries = ds.getBatchSummaries
  create = ds.create
  duplicate = ds.duplicate
  update = ds.update
  checkMixedChannelRisk = ds.checkMixedChannelRisk
  deleteAccount = ds.deleteAccount
  toggleStatus = ds.toggleStatus
  testAccount = ds.testAccount
  refreshCredentials = ds.refreshCredentials
  applyOAuthCredentials = ds.applyOAuthCredentials
  getStats = ds.getStats
  clearError = ds.clearError
  getUsage = ds.getUsage
  clearRateLimit = ds.clearRateLimit
  recoverState = ds.recoverState
  resetAccountQuota = ds.resetAccountQuota
  getTempUnschedulableStatus = ds.getTempUnschedulableStatus
  resetTempUnschedulable = ds.resetTempUnschedulable
  generateAuthUrl = ds.generateAuthUrl
  exchangeCode = ds.exchangeCode
  batchCreate = ds.batchCreate
  batchUpdateCredentials = ds.batchUpdateCredentials
  bulkUpdate = ds.bulkUpdate
  getTodayStats = ds.getTodayStats
  getBatchTodayStats = ds.getBatchTodayStats
  setSchedulable = ds.setSchedulable
  getAvailableModels = ds.getAvailableModels
  syncUpstreamModels = ds.syncUpstreamModels
  syncUpstreamModelsPreview = ds.syncUpstreamModelsPreview
  previewFromCrs = ds.previewFromCrs
  syncFromCrs = ds.syncFromCrs
  exportData = ds.exportData
  importData = ds.importData
  importCodexSession = ds.importCodexSession
  createOpenAICodexPAT = ds.createOpenAICodexPAT
  getAntigravityDefaultModelMapping = ds.getAntigravityDefaultModelMapping
  refreshOpenAIToken = ds.refreshOpenAIToken
  revertProxyFallback = ds.revertProxyFallback
  batchClearError = ds.batchClearError
  batchRefresh = ds.batchRefresh
  setPrivacy = ds.setPrivacy
  queryOpenAIQuota = ds.queryOpenAIQuota
  resetOpenAIQuota = ds.resetOpenAIQuota
  createSparkShadow = ds.createSparkShadow
  getUpstreamBillingProbeSettings = ds.getUpstreamBillingProbeSettings
  updateUpstreamBillingProbeSettings = ds.updateUpstreamBillingProbeSettings
  setUpstreamBillingProbeEnabled = ds.setUpstreamBillingProbeEnabled
  probeUpstreamBilling = ds.probeUpstreamBilling
  probeUpstreamBillingBatch = ds.probeUpstreamBillingBatch
}

export const adminAccountsRepository: AdminAccountsRepository = new AdminAccountsRepositoryImpl()
