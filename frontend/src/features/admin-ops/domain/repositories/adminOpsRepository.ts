/**
 * AdminOpsRepository (interface). Auto-generated from adminOpsDatasource.ts.
 */
import type * as ds from '@/features/admin-ops/data/datasources/adminOpsDatasource'

export type AdminOpsRepository = {
  readonly getConcurrencyStats: typeof ds.getConcurrencyStats
  readonly getUserConcurrencyStats: typeof ds.getUserConcurrencyStats
  readonly getAccountAvailabilityStats: typeof ds.getAccountAvailabilityStats
  readonly getRealtimeTrafficSummary: typeof ds.getRealtimeTrafficSummary
  readonly subscribeQPS: typeof ds.subscribeQPS
  readonly getDashboardOverview: typeof ds.getDashboardOverview
  readonly getDashboardSnapshotV2: typeof ds.getDashboardSnapshotV2
  readonly getThroughputTrend: typeof ds.getThroughputTrend
  readonly getLatencyHistogram: typeof ds.getLatencyHistogram
  readonly getErrorTrend: typeof ds.getErrorTrend
  readonly getErrorDistribution: typeof ds.getErrorDistribution
  readonly getImageGenerationStats: typeof ds.getImageGenerationStats
  readonly getOpenAITokenStats: typeof ds.getOpenAITokenStats
  readonly getUserUsageStats: typeof ds.getUserUsageStats
  readonly listErrorLogs: typeof ds.listErrorLogs
  readonly getErrorLogDetail: typeof ds.getErrorLogDetail
  readonly updateErrorResolved: typeof ds.updateErrorResolved
  readonly listRequestErrors: typeof ds.listRequestErrors
  readonly listUpstreamErrors: typeof ds.listUpstreamErrors
  readonly getRequestErrorDetail: typeof ds.getRequestErrorDetail
  readonly getUpstreamErrorDetail: typeof ds.getUpstreamErrorDetail
  readonly updateRequestErrorResolved: typeof ds.updateRequestErrorResolved
  readonly updateUpstreamErrorResolved: typeof ds.updateUpstreamErrorResolved
  readonly listRequestErrorUpstreamErrors: typeof ds.listRequestErrorUpstreamErrors
  readonly listRequestDetails: typeof ds.listRequestDetails
  readonly listAlertRules: typeof ds.listAlertRules
  readonly createAlertRule: typeof ds.createAlertRule
  readonly updateAlertRule: typeof ds.updateAlertRule
  readonly deleteAlertRule: typeof ds.deleteAlertRule
  readonly listAlertEvents: typeof ds.listAlertEvents
  readonly getAlertEvent: typeof ds.getAlertEvent
  readonly updateAlertEventStatus: typeof ds.updateAlertEventStatus
  readonly createAlertSilence: typeof ds.createAlertSilence
  readonly getEmailNotificationConfig: typeof ds.getEmailNotificationConfig
  readonly getSettingsSnapshot: typeof ds.getSettingsSnapshot
  readonly updateEmailNotificationConfig: typeof ds.updateEmailNotificationConfig
  readonly getAlertRuntimeSettings: typeof ds.getAlertRuntimeSettings
  readonly updateAlertRuntimeSettings: typeof ds.updateAlertRuntimeSettings
  readonly getRuntimeLogConfig: typeof ds.getRuntimeLogConfig
  readonly updateRuntimeLogConfig: typeof ds.updateRuntimeLogConfig
  readonly resetRuntimeLogConfig: typeof ds.resetRuntimeLogConfig
  readonly listSystemLogs: typeof ds.listSystemLogs
  readonly cleanupSystemLogs: typeof ds.cleanupSystemLogs
  readonly getSystemLogSinkHealth: typeof ds.getSystemLogSinkHealth
  readonly getAdvancedSettings: typeof ds.getAdvancedSettings
  readonly updateAdvancedSettings: typeof ds.updateAdvancedSettings
}
