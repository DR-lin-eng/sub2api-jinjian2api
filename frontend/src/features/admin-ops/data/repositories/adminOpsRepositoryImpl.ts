/**
 * AdminOpsRepositoryImpl. Auto-generated from adminOpsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-ops/data/datasources/adminOpsDatasource'
import type { AdminOpsRepository } from '@/features/admin-ops/domain/repositories/adminOpsRepository'

export class AdminOpsRepositoryImpl implements AdminOpsRepository {
  getConcurrencyStats = ds.getConcurrencyStats
  getUserConcurrencyStats = ds.getUserConcurrencyStats
  getAccountAvailabilityStats = ds.getAccountAvailabilityStats
  getRealtimeTrafficSummary = ds.getRealtimeTrafficSummary
  subscribeQPS = ds.subscribeQPS
  getDashboardOverview = ds.getDashboardOverview
  getDashboardSnapshotV2 = ds.getDashboardSnapshotV2
  getThroughputTrend = ds.getThroughputTrend
  getLatencyHistogram = ds.getLatencyHistogram
  getErrorTrend = ds.getErrorTrend
  getErrorDistribution = ds.getErrorDistribution
  getImageGenerationStats = ds.getImageGenerationStats
  getOpenAITokenStats = ds.getOpenAITokenStats
  getUserUsageStats = ds.getUserUsageStats
  listErrorLogs = ds.listErrorLogs
  getErrorLogDetail = ds.getErrorLogDetail
  updateErrorResolved = ds.updateErrorResolved
  listRequestErrors = ds.listRequestErrors
  listUpstreamErrors = ds.listUpstreamErrors
  getRequestErrorDetail = ds.getRequestErrorDetail
  getUpstreamErrorDetail = ds.getUpstreamErrorDetail
  updateRequestErrorResolved = ds.updateRequestErrorResolved
  updateUpstreamErrorResolved = ds.updateUpstreamErrorResolved
  listRequestErrorUpstreamErrors = ds.listRequestErrorUpstreamErrors
  listRequestDetails = ds.listRequestDetails
  listAlertRules = ds.listAlertRules
  createAlertRule = ds.createAlertRule
  updateAlertRule = ds.updateAlertRule
  deleteAlertRule = ds.deleteAlertRule
  listAlertEvents = ds.listAlertEvents
  getAlertEvent = ds.getAlertEvent
  updateAlertEventStatus = ds.updateAlertEventStatus
  createAlertSilence = ds.createAlertSilence
  getEmailNotificationConfig = ds.getEmailNotificationConfig
  getSettingsSnapshot = ds.getSettingsSnapshot
  updateEmailNotificationConfig = ds.updateEmailNotificationConfig
  getAlertRuntimeSettings = ds.getAlertRuntimeSettings
  updateAlertRuntimeSettings = ds.updateAlertRuntimeSettings
  getRuntimeLogConfig = ds.getRuntimeLogConfig
  updateRuntimeLogConfig = ds.updateRuntimeLogConfig
  resetRuntimeLogConfig = ds.resetRuntimeLogConfig
  listSystemLogs = ds.listSystemLogs
  cleanupSystemLogs = ds.cleanupSystemLogs
  getSystemLogSinkHealth = ds.getSystemLogSinkHealth
  getAdvancedSettings = ds.getAdvancedSettings
  updateAdvancedSettings = ds.updateAdvancedSettings
}

export const adminOpsRepository: AdminOpsRepository = new AdminOpsRepositoryImpl()
