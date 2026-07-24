import type { PaginatedResponse } from '@/types'
import type { OpsErrorLog } from '@/features/admin-ops/domain/models/opsErrorLog'
import type { OpsErrorDetail } from '@/features/admin-ops/domain/models/opsErrorDetail'
import type { AlertRule } from '@/features/admin-ops/domain/models/alertRule'
import type { AlertEvent } from '@/features/admin-ops/domain/models/alertEvent'
import type { OpsSystemLog } from '@/features/admin-ops/domain/models/opsSystemLog'
import type { OpsSystemLogSinkHealth } from '@/features/admin-ops/domain/models/opsSystemLogSinkHealth'
import type { EmailNotificationConfig } from '@/features/admin-ops/domain/models/emailNotificationConfig'
import type { OpsAlertRuntimeSettings } from '@/features/admin-ops/domain/models/opsAlertRuntimeSettings'
import type { OpsRuntimeLogConfig } from '@/features/admin-ops/domain/models/opsRuntimeLogConfig'
import type { OpsAdvancedSettings } from '@/features/admin-ops/domain/models/opsAdvancedSettings'
import type { OpsDashboardOverview } from '@/features/admin-ops/domain/models/opsDashboardOverview'
import type { OpsDashboardSnapshotV2 } from '@/features/admin-ops/domain/models/opsDashboardSnapshotV2'
import type { OpsThroughputTrendResponse } from '@/features/admin-ops/domain/models/opsThroughputTrendResponse'
import type { OpsLatencyHistogramResponse } from '@/features/admin-ops/domain/models/opsLatencyHistogramResponse'
import type { OpsErrorTrendResponse } from '@/features/admin-ops/domain/models/opsErrorTrendResponse'
import type { OpsErrorDistributionResponse } from '@/features/admin-ops/domain/models/opsErrorDistributionResponse'
import type { OpsConcurrencyStats } from '@/features/admin-ops/domain/models/opsConcurrencyStats'
import type { OpsUserConcurrencyStats } from '@/features/admin-ops/domain/models/opsUserConcurrencyStats'
import type { OpsAccountAvailabilityStats } from '@/features/admin-ops/domain/models/opsAccountAvailabilityStats'
import type { OpsRealtimeTrafficSummaryResponse } from '@/features/admin-ops/domain/models/opsRealtimeTrafficSummaryResponse'
import type { OpsImageGenerationStats } from '@/features/admin-ops/domain/models/opsImageGenerationStats'
import type { OpsOpenAITokenStats } from '@/features/admin-ops/domain/models/opsOpenAITokenStats'
import type { OpsUserUsageStats } from '@/features/admin-ops/domain/models/opsUserUsageStats'
import type { OpsDashboardQueryParams, OpsDashboardSnapshotV2Params } from '@/features/admin-ops/data/requests_models/opsDashboardQueryParams'
import type { OpsErrorListQueryParams } from '@/features/admin-ops/data/requests_models/opsErrorListQueryParams'
import type { OpsRequestDetailsParams } from '@/features/admin-ops/data/requests_models/opsRequestDetailsParams'
import type { OpsSystemLogQuery } from '@/features/admin-ops/data/requests_models/opsSystemLogQuery'
import type { AlertEventsQuery } from '@/features/admin-ops/data/requests_models/alertEventsQuery'
import type { OpsImageGenerationStatsParams } from '@/features/admin-ops/data/requests_models/opsImageGenerationStatsParams'
import type { OpsOpenAITokenStatsParams } from '@/features/admin-ops/data/requests_models/opsOpenAITokenStatsParams'
import type { OpsUserUsageStatsParams } from '@/features/admin-ops/data/requests_models/opsUserUsageStatsParams'
import type { SubscribeQPSOptions } from '@/features/admin-ops/data/requests_models/subscribeQpsOptions'

export interface AdminOpsQueryRepository {
  getConcurrencyStats(platform?: string, groupId?: number | null): Promise<OpsConcurrencyStats>
  getUserConcurrencyStats(): Promise<OpsUserConcurrencyStats>
  getAccountAvailabilityStats(platform?: string, groupId?: number | null): Promise<OpsAccountAvailabilityStats>
  getRealtimeTrafficSummary(window: string, platform?: string, groupId?: number | null): Promise<OpsRealtimeTrafficSummaryResponse>
  subscribeQPS(onMessage: (data: unknown) => void, options?: SubscribeQPSOptions): () => void
  getDashboardOverview(params: OpsDashboardQueryParams, options?: { signal?: AbortSignal }): Promise<OpsDashboardOverview>
  getDashboardSnapshotV2(params: OpsDashboardSnapshotV2Params, options?: { signal?: AbortSignal }): Promise<OpsDashboardSnapshotV2>
  getThroughputTrend(params: OpsDashboardQueryParams, options?: { signal?: AbortSignal }): Promise<OpsThroughputTrendResponse>
  getLatencyHistogram(params: OpsDashboardQueryParams, options?: { signal?: AbortSignal }): Promise<OpsLatencyHistogramResponse>
  getErrorTrend(params: OpsDashboardQueryParams, options?: { signal?: AbortSignal }): Promise<OpsErrorTrendResponse>
  getErrorDistribution(params: OpsDashboardQueryParams, options?: { signal?: AbortSignal }): Promise<OpsErrorDistributionResponse>
  getImageGenerationStats(params: OpsImageGenerationStatsParams, options?: { signal?: AbortSignal }): Promise<OpsImageGenerationStats>
  getOpenAITokenStats(params: OpsOpenAITokenStatsParams, options?: { signal?: AbortSignal }): Promise<OpsOpenAITokenStats>
  getUserUsageStats(params: OpsUserUsageStatsParams, options?: { signal?: AbortSignal }): Promise<OpsUserUsageStats>
  listErrorLogs(params: OpsErrorListQueryParams): Promise<PaginatedResponse<OpsErrorLog>>
  getErrorLogDetail(id: number): Promise<OpsErrorDetail>
  listRequestErrors(params: OpsErrorListQueryParams): Promise<PaginatedResponse<OpsErrorLog>>
  listUpstreamErrors(params: OpsErrorListQueryParams): Promise<PaginatedResponse<OpsErrorLog>>
  getRequestErrorDetail(id: number): Promise<OpsErrorDetail>
  getUpstreamErrorDetail(id: number): Promise<OpsErrorDetail>
  listRequestErrorUpstreamErrors(id: number, params?: OpsErrorListQueryParams, options?: { include_detail?: boolean }): Promise<PaginatedResponse<OpsErrorDetail>>
  listRequestDetails(params: OpsRequestDetailsParams): Promise<PaginatedResponse<unknown>>
  listAlertRules(): Promise<AlertRule[]>
  listAlertEvents(params?: AlertEventsQuery): Promise<AlertEvent[]>
  getAlertEvent(id: number): Promise<AlertEvent>
  getEmailNotificationConfig(): Promise<EmailNotificationConfig>
  getSettingsSnapshot(): Promise<unknown>
  getAlertRuntimeSettings(): Promise<OpsAlertRuntimeSettings>
  getRuntimeLogConfig(): Promise<OpsRuntimeLogConfig>
  listSystemLogs(params: OpsSystemLogQuery): Promise<PaginatedResponse<OpsSystemLog>>
  getSystemLogSinkHealth(): Promise<OpsSystemLogSinkHealth>
  getAdvancedSettings(): Promise<OpsAdvancedSettings>
}
