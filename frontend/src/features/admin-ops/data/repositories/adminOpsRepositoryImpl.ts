/**
 * AdminOpsRepositoryImpl. Auto-generated from adminOpsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-ops/data/datasources/adminOpsDatasource'
import type { AdminOpsRepository } from '@/features/admin-ops/domain/repositories/adminOpsRepository'

export class AdminOpsRepositoryImpl implements AdminOpsRepository {
  get getConcurrencyStats(): typeof ds.getConcurrencyStats { return ds.getConcurrencyStats }
  get getUserConcurrencyStats(): typeof ds.getUserConcurrencyStats { return ds.getUserConcurrencyStats }
  get getAccountAvailabilityStats(): typeof ds.getAccountAvailabilityStats { return ds.getAccountAvailabilityStats }
  get getRealtimeTrafficSummary(): typeof ds.getRealtimeTrafficSummary { return ds.getRealtimeTrafficSummary }
  get subscribeQPS(): typeof ds.subscribeQPS { return ds.subscribeQPS }
  get getDashboardOverview(): typeof ds.getDashboardOverview { return ds.getDashboardOverview }
  get getDashboardSnapshotV2(): typeof ds.getDashboardSnapshotV2 { return ds.getDashboardSnapshotV2 }
  get getThroughputTrend(): typeof ds.getThroughputTrend { return ds.getThroughputTrend }
  get getLatencyHistogram(): typeof ds.getLatencyHistogram { return ds.getLatencyHistogram }
  get getErrorTrend(): typeof ds.getErrorTrend { return ds.getErrorTrend }
  get getErrorDistribution(): typeof ds.getErrorDistribution { return ds.getErrorDistribution }
  get getImageGenerationStats(): typeof ds.getImageGenerationStats { return ds.getImageGenerationStats }
  get getOpenAITokenStats(): typeof ds.getOpenAITokenStats { return ds.getOpenAITokenStats }
  get getUserUsageStats(): typeof ds.getUserUsageStats { return ds.getUserUsageStats }
  get listErrorLogs(): typeof ds.listErrorLogs { return ds.listErrorLogs }
  get getErrorLogDetail(): typeof ds.getErrorLogDetail { return ds.getErrorLogDetail }
  get updateErrorResolved(): typeof ds.updateErrorResolved { return ds.updateErrorResolved }
  get listRequestErrors(): typeof ds.listRequestErrors { return ds.listRequestErrors }
  get listUpstreamErrors(): typeof ds.listUpstreamErrors { return ds.listUpstreamErrors }
  get getRequestErrorDetail(): typeof ds.getRequestErrorDetail { return ds.getRequestErrorDetail }
  get getUpstreamErrorDetail(): typeof ds.getUpstreamErrorDetail { return ds.getUpstreamErrorDetail }
  get updateRequestErrorResolved(): typeof ds.updateRequestErrorResolved { return ds.updateRequestErrorResolved }
  get updateUpstreamErrorResolved(): typeof ds.updateUpstreamErrorResolved { return ds.updateUpstreamErrorResolved }
  get listRequestErrorUpstreamErrors(): typeof ds.listRequestErrorUpstreamErrors { return ds.listRequestErrorUpstreamErrors }
  get listRequestDetails(): typeof ds.listRequestDetails { return ds.listRequestDetails }
  get listAlertRules(): typeof ds.listAlertRules { return ds.listAlertRules }
  get createAlertRule(): typeof ds.createAlertRule { return ds.createAlertRule }
  get updateAlertRule(): typeof ds.updateAlertRule { return ds.updateAlertRule }
  get deleteAlertRule(): typeof ds.deleteAlertRule { return ds.deleteAlertRule }
  get listAlertEvents(): typeof ds.listAlertEvents { return ds.listAlertEvents }
  get getAlertEvent(): typeof ds.getAlertEvent { return ds.getAlertEvent }
  get updateAlertEventStatus(): typeof ds.updateAlertEventStatus { return ds.updateAlertEventStatus }
  get createAlertSilence(): typeof ds.createAlertSilence { return ds.createAlertSilence }
  get getEmailNotificationConfig(): typeof ds.getEmailNotificationConfig { return ds.getEmailNotificationConfig }
  get getSettingsSnapshot(): typeof ds.getSettingsSnapshot { return ds.getSettingsSnapshot }
  get updateEmailNotificationConfig(): typeof ds.updateEmailNotificationConfig { return ds.updateEmailNotificationConfig }
  get getAlertRuntimeSettings(): typeof ds.getAlertRuntimeSettings { return ds.getAlertRuntimeSettings }
  get updateAlertRuntimeSettings(): typeof ds.updateAlertRuntimeSettings { return ds.updateAlertRuntimeSettings }
  get getRuntimeLogConfig(): typeof ds.getRuntimeLogConfig { return ds.getRuntimeLogConfig }
  get updateRuntimeLogConfig(): typeof ds.updateRuntimeLogConfig { return ds.updateRuntimeLogConfig }
  get resetRuntimeLogConfig(): typeof ds.resetRuntimeLogConfig { return ds.resetRuntimeLogConfig }
  get listSystemLogs(): typeof ds.listSystemLogs { return ds.listSystemLogs }
  get cleanupSystemLogs(): typeof ds.cleanupSystemLogs { return ds.cleanupSystemLogs }
  get getSystemLogSinkHealth(): typeof ds.getSystemLogSinkHealth { return ds.getSystemLogSinkHealth }
  get getAdvancedSettings(): typeof ds.getAdvancedSettings { return ds.getAdvancedSettings }
  get updateAdvancedSettings(): typeof ds.updateAdvancedSettings { return ds.updateAdvancedSettings }
}

export const adminOpsRepository: AdminOpsRepository = new AdminOpsRepositoryImpl()
