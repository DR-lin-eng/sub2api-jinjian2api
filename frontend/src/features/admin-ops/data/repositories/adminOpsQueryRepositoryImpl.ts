import { adminOpsQueryDatasource } from '@/features/admin-ops/data/datasources/adminOpsQueryDatasource'
import type { AdminOpsQueryRepository } from '@/features/admin-ops/domain/repositories/adminOpsQueryRepository'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
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
import type { OpsSettingsSnapshot } from '@/features/admin-ops/domain/models/opsSettingsSnapshot'
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

export class AdminOpsQueryRepositoryImpl implements AdminOpsQueryRepository {
  private readonly ds = adminOpsQueryDatasource

  subscribeQPS(onMessage: (data: unknown) => void, options = {}) {
    return this.ds.subscribeQPS(onMessage, options)
  }

  getConcurrencyStats = async (platform?: string, groupId?: number | null) : Promise<OpsConcurrencyStats>  => {
    return (await this.ds.getConcurrencyStats(platform, groupId)).toEntity()
  }

  getUserConcurrencyStats = async () : Promise<OpsUserConcurrencyStats>  => {
    return (await this.ds.getUserConcurrencyStats()).toEntity()
  }

  getAccountAvailabilityStats = async (platform?: string, groupId?: number | null) : Promise<OpsAccountAvailabilityStats>  => {
    return (await this.ds.getAccountAvailabilityStats(platform, groupId)).toEntity()
  }

  getRealtimeTrafficSummary = async (window: string, platform?: string, groupId?: number | null) : Promise<OpsRealtimeTrafficSummaryResponse>  => {
    return (await this.ds.getRealtimeTrafficSummary(window, platform, groupId)).toEntity()
  }

  getDashboardOverview = async (params: Parameters<typeof adminOpsQueryDatasource.getDashboardOverview>[0], options?: { signal?: AbortSignal }) : Promise<OpsDashboardOverview>  => {
    return (await this.ds.getDashboardOverview(params, options ?? {})).toEntity()
  }

  getDashboardSnapshotV2 = async (params: Parameters<typeof adminOpsQueryDatasource.getDashboardSnapshotV2>[0], options?: { signal?: AbortSignal }) : Promise<OpsDashboardSnapshotV2>  => {
    return (await this.ds.getDashboardSnapshotV2(params, options ?? {})).toEntity()
  }

  getThroughputTrend = async (params: Parameters<typeof adminOpsQueryDatasource.getThroughputTrend>[0], options?: { signal?: AbortSignal }) : Promise<OpsThroughputTrendResponse>  => {
    return (await this.ds.getThroughputTrend(params, options ?? {})).toEntity()
  }

  getLatencyHistogram = async (params: Parameters<typeof adminOpsQueryDatasource.getLatencyHistogram>[0], options?: { signal?: AbortSignal }) : Promise<OpsLatencyHistogramResponse>  => {
    return (await this.ds.getLatencyHistogram(params, options ?? {})).toEntity()
  }

  getErrorTrend = async (params: Parameters<typeof adminOpsQueryDatasource.getErrorTrend>[0], options?: { signal?: AbortSignal }) : Promise<OpsErrorTrendResponse>  => {
    return (await this.ds.getErrorTrend(params, options ?? {})).toEntity()
  }

  getErrorDistribution = async (params: Parameters<typeof adminOpsQueryDatasource.getErrorDistribution>[0], options?: { signal?: AbortSignal }) : Promise<OpsErrorDistributionResponse>  => {
    return (await this.ds.getErrorDistribution(params, options ?? {})).toEntity()
  }

  getImageGenerationStats = async (params: Parameters<typeof adminOpsQueryDatasource.getImageGenerationStats>[0], options?: { signal?: AbortSignal }) : Promise<OpsImageGenerationStats>  => {
    return (await this.ds.getImageGenerationStats(params, options ?? {})).toEntity()
  }

  getOpenAITokenStats = async (params: Parameters<typeof adminOpsQueryDatasource.getOpenAITokenStats>[0], options?: { signal?: AbortSignal }) : Promise<OpsOpenAITokenStats>  => {
    return (await this.ds.getOpenAITokenStats(params, options ?? {})).toEntity()
  }

  getUserUsageStats = async (params: Parameters<typeof adminOpsQueryDatasource.getUserUsageStats>[0], options?: { signal?: AbortSignal }) : Promise<OpsUserUsageStats>  => {
    return (await this.ds.getUserUsageStats(params, options ?? {})).toEntity()
  }

  listErrorLogs = async (params: Parameters<typeof adminOpsQueryDatasource.listErrorLogs>[0]) : Promise<PaginatedResponse<OpsErrorLog>>  => {
    const result = await this.ds.listErrorLogs(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getErrorLogDetail = async (id: number) : Promise<OpsErrorDetail>  => {
    return (await this.ds.getErrorLogDetail(id)).toEntity()
  }

  listRequestErrors = async (params: Parameters<typeof adminOpsQueryDatasource.listRequestErrors>[0]) : Promise<PaginatedResponse<OpsErrorLog>>  => {
    const result = await this.ds.listRequestErrors(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  listUpstreamErrors = async (params: Parameters<typeof adminOpsQueryDatasource.listUpstreamErrors>[0]) : Promise<PaginatedResponse<OpsErrorLog>>  => {
    const result = await this.ds.listUpstreamErrors(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getRequestErrorDetail = async (id: number) : Promise<OpsErrorDetail>  => {
    return (await this.ds.getRequestErrorDetail(id)).toEntity()
  }

  getUpstreamErrorDetail = async (id: number) : Promise<OpsErrorDetail>  => {
    return (await this.ds.getUpstreamErrorDetail(id)).toEntity()
  }

  listRequestErrorUpstreamErrors = async (id: number, params = {}, options = {}) : Promise<PaginatedResponse<OpsErrorDetail>>  => {
    const result = await this.ds.listRequestErrorUpstreamErrors(id, params, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  listRequestDetails = async (params: Parameters<typeof adminOpsQueryDatasource.listRequestDetails>[0]) : Promise<PaginatedResponse<unknown>>  => {
    return this.ds.listRequestDetails(params)
  }

  listAlertRules = async () : Promise<AlertRule[]>  => {
    return (await this.ds.listAlertRules()).map(dto => dto.toEntity())
  }

  listAlertEvents = async (params = {}) : Promise<AlertEvent[]>  => {
    return (await this.ds.listAlertEvents(params)).map(dto => dto.toEntity())
  }

  getAlertEvent = async (id: number) : Promise<AlertEvent>  => {
    return (await this.ds.getAlertEvent(id)).toEntity()
  }

  getEmailNotificationConfig = async () : Promise<EmailNotificationConfig>  => {
    return (await this.ds.getEmailNotificationConfig()).toEntity()
  }

  getSettingsSnapshot = async () : Promise<OpsSettingsSnapshot>  => {
    return (await this.ds.getSettingsSnapshot()).toEntity()
  }

  getAlertRuntimeSettings = async () : Promise<OpsAlertRuntimeSettings>  => {
    return (await this.ds.getAlertRuntimeSettings()).toEntity()
  }

  getRuntimeLogConfig = async () : Promise<OpsRuntimeLogConfig>  => {
    return (await this.ds.getRuntimeLogConfig()).toEntity()
  }

  listSystemLogs = async (params: Parameters<typeof adminOpsQueryDatasource.listSystemLogs>[0]) : Promise<PaginatedResponse<OpsSystemLog>>  => {
    const result = await this.ds.listSystemLogs(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getSystemLogSinkHealth = async () : Promise<OpsSystemLogSinkHealth>  => {
    return (await this.ds.getSystemLogSinkHealth()).toEntity()
  }

  getAdvancedSettings = async () : Promise<OpsAdvancedSettings>  => {
    return (await this.ds.getAdvancedSettings()).toEntity()
  }
}

export const adminOpsQueryRepository: AdminOpsQueryRepository = new AdminOpsQueryRepositoryImpl()
