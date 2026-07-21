/**
 * AdminOpsRepository (interface). Auto-generated from adminOpsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminOpsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-ops/data/datasources/adminOpsDatasource'

export type AdminOpsRepository = {
  getConcurrencyStats: typeof ds.getConcurrencyStats
  getUserConcurrencyStats: typeof ds.getUserConcurrencyStats
  getAccountAvailabilityStats: typeof ds.getAccountAvailabilityStats
  getRealtimeTrafficSummary: typeof ds.getRealtimeTrafficSummary
  subscribeQPS: typeof ds.subscribeQPS
  getDashboardOverview: typeof ds.getDashboardOverview
  getDashboardSnapshotV2: typeof ds.getDashboardSnapshotV2
  getThroughputTrend: typeof ds.getThroughputTrend
  getLatencyHistogram: typeof ds.getLatencyHistogram
  getErrorTrend: typeof ds.getErrorTrend
  getErrorDistribution: typeof ds.getErrorDistribution
  getImageGenerationStats: typeof ds.getImageGenerationStats
  getOpenAITokenStats: typeof ds.getOpenAITokenStats
  getUserUsageStats: typeof ds.getUserUsageStats
  listErrorLogs: typeof ds.listErrorLogs
  getErrorLogDetail: typeof ds.getErrorLogDetail
  updateErrorResolved: typeof ds.updateErrorResolved
  listRequestErrors: typeof ds.listRequestErrors
  listUpstreamErrors: typeof ds.listUpstreamErrors
  getRequestErrorDetail: typeof ds.getRequestErrorDetail
  getUpstreamErrorDetail: typeof ds.getUpstreamErrorDetail
  updateRequestErrorResolved: typeof ds.updateRequestErrorResolved
  updateUpstreamErrorResolved: typeof ds.updateUpstreamErrorResolved
  listRequestErrorUpstreamErrors: typeof ds.listRequestErrorUpstreamErrors
  listRequestDetails: typeof ds.listRequestDetails
  listAlertRules: typeof ds.listAlertRules
  createAlertRule: typeof ds.createAlertRule
  updateAlertRule: typeof ds.updateAlertRule
  deleteAlertRule: typeof ds.deleteAlertRule
  listAlertEvents: typeof ds.listAlertEvents
  getAlertEvent: typeof ds.getAlertEvent
  updateAlertEventStatus: typeof ds.updateAlertEventStatus
  createAlertSilence: typeof ds.createAlertSilence
  getEmailNotificationConfig: typeof ds.getEmailNotificationConfig
  getSettingsSnapshot: typeof ds.getSettingsSnapshot
  updateEmailNotificationConfig: typeof ds.updateEmailNotificationConfig
  getAlertRuntimeSettings: typeof ds.getAlertRuntimeSettings
  updateAlertRuntimeSettings: typeof ds.updateAlertRuntimeSettings
  getRuntimeLogConfig: typeof ds.getRuntimeLogConfig
  updateRuntimeLogConfig: typeof ds.updateRuntimeLogConfig
  resetRuntimeLogConfig: typeof ds.resetRuntimeLogConfig
  listSystemLogs: typeof ds.listSystemLogs
  cleanupSystemLogs: typeof ds.cleanupSystemLogs
  getSystemLogSinkHealth: typeof ds.getSystemLogSinkHealth
  getAdvancedSettings: typeof ds.getAdvancedSettings
  updateAdvancedSettings: typeof ds.updateAdvancedSettings
}
