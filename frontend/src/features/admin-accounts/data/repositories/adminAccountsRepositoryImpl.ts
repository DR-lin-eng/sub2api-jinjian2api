/**
 * AdminAccountsRepositoryImpl. Auto-generated from adminAccountsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'
import type { AdminAccountsRepository } from '@/features/admin-accounts/domain/repositories/adminAccountsRepository'

export class AdminAccountsRepositoryImpl implements AdminAccountsRepository {
  get list(): typeof ds.list { return ds.list }
  get listWithEtag(): typeof ds.listWithEtag { return ds.listWithEtag }
  get getById(): typeof ds.getById { return ds.getById }
  get getBatchSummaries(): typeof ds.getBatchSummaries { return ds.getBatchSummaries }
  get create(): typeof ds.create { return ds.create }
  get duplicate(): typeof ds.duplicate { return ds.duplicate }
  get update(): typeof ds.update { return ds.update }
  get checkMixedChannelRisk(): typeof ds.checkMixedChannelRisk { return ds.checkMixedChannelRisk }
  get deleteAccount(): typeof ds.deleteAccount { return ds.deleteAccount }
  get toggleStatus(): typeof ds.toggleStatus { return ds.toggleStatus }
  get testAccount(): typeof ds.testAccount { return ds.testAccount }
  get refreshCredentials(): typeof ds.refreshCredentials { return ds.refreshCredentials }
  get applyOAuthCredentials(): typeof ds.applyOAuthCredentials { return ds.applyOAuthCredentials }
  get getStats(): typeof ds.getStats { return ds.getStats }
  get clearError(): typeof ds.clearError { return ds.clearError }
  get getUsage(): typeof ds.getUsage { return ds.getUsage }
  get clearRateLimit(): typeof ds.clearRateLimit { return ds.clearRateLimit }
  get recoverState(): typeof ds.recoverState { return ds.recoverState }
  get resetAccountQuota(): typeof ds.resetAccountQuota { return ds.resetAccountQuota }
  get getTempUnschedulableStatus(): typeof ds.getTempUnschedulableStatus { return ds.getTempUnschedulableStatus }
  get resetTempUnschedulable(): typeof ds.resetTempUnschedulable { return ds.resetTempUnschedulable }
  get generateAuthUrl(): typeof ds.generateAuthUrl { return ds.generateAuthUrl }
  get exchangeCode(): typeof ds.exchangeCode { return ds.exchangeCode }
  get batchCreate(): typeof ds.batchCreate { return ds.batchCreate }
  get batchUpdateCredentials(): typeof ds.batchUpdateCredentials { return ds.batchUpdateCredentials }
  get bulkUpdate(): typeof ds.bulkUpdate { return ds.bulkUpdate }
  get getTodayStats(): typeof ds.getTodayStats { return ds.getTodayStats }
  get getBatchTodayStats(): typeof ds.getBatchTodayStats { return ds.getBatchTodayStats }
  get setSchedulable(): typeof ds.setSchedulable { return ds.setSchedulable }
  get getAvailableModels(): typeof ds.getAvailableModels { return ds.getAvailableModels }
  get syncUpstreamModels(): typeof ds.syncUpstreamModels { return ds.syncUpstreamModels }
  get syncUpstreamModelsPreview(): typeof ds.syncUpstreamModelsPreview { return ds.syncUpstreamModelsPreview }
  get previewFromCrs(): typeof ds.previewFromCrs { return ds.previewFromCrs }
  get syncFromCrs(): typeof ds.syncFromCrs { return ds.syncFromCrs }
  get exportData(): typeof ds.exportData { return ds.exportData }
  get importData(): typeof ds.importData { return ds.importData }
  get importCodexSession(): typeof ds.importCodexSession { return ds.importCodexSession }
  get createOpenAICodexPAT(): typeof ds.createOpenAICodexPAT { return ds.createOpenAICodexPAT }
  get getAntigravityDefaultModelMapping(): typeof ds.getAntigravityDefaultModelMapping { return ds.getAntigravityDefaultModelMapping }
  get refreshOpenAIToken(): typeof ds.refreshOpenAIToken { return ds.refreshOpenAIToken }
  get revertProxyFallback(): typeof ds.revertProxyFallback { return ds.revertProxyFallback }
  get batchClearError(): typeof ds.batchClearError { return ds.batchClearError }
  get batchRefresh(): typeof ds.batchRefresh { return ds.batchRefresh }
  get setPrivacy(): typeof ds.setPrivacy { return ds.setPrivacy }
  get queryOpenAIQuota(): typeof ds.queryOpenAIQuota { return ds.queryOpenAIQuota }
  get resetOpenAIQuota(): typeof ds.resetOpenAIQuota { return ds.resetOpenAIQuota }
  get createSparkShadow(): typeof ds.createSparkShadow { return ds.createSparkShadow }
  get getUpstreamBillingProbeSettings(): typeof ds.getUpstreamBillingProbeSettings { return ds.getUpstreamBillingProbeSettings }
  get updateUpstreamBillingProbeSettings(): typeof ds.updateUpstreamBillingProbeSettings { return ds.updateUpstreamBillingProbeSettings }
  get setUpstreamBillingProbeEnabled(): typeof ds.setUpstreamBillingProbeEnabled { return ds.setUpstreamBillingProbeEnabled }
  get probeUpstreamBilling(): typeof ds.probeUpstreamBilling { return ds.probeUpstreamBilling }
  get probeUpstreamBillingBatch(): typeof ds.probeUpstreamBillingBatch { return ds.probeUpstreamBillingBatch }
}

export const adminAccountsRepository: AdminAccountsRepository = new AdminAccountsRepositoryImpl()
