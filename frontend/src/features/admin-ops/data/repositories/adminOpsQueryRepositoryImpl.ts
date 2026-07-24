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

  async getConcurrencyStats(platform?: string, groupId?: number | null): Promise<OpsConcurrencyStats> {
    return (await this.ds.getConcurrencyStats(platform, groupId)).toEntity()
  }

  async getUserConcurrencyStats(): Promise<OpsUserConcurrencyStats> {
    return (await this.ds.getUserConcurrencyStats()).toEntity()
  }

  async getAccountAvailabilityStats(platform?: string, groupId?: number | null): Promise<OpsAccountAvailabilityStats> {
    return (await this.ds.getAccountAvailabilityStats(platform, groupId)).toEntity()
  }

  async getRealtimeTrafficSummary(window: string, platform?: string, groupId?: number | null): Promise<OpsRealtimeTrafficSummaryResponse> {
    return (await this.ds.getRealtimeTrafficSummary(window, platform, groupId)).toEntity()
  }

  async getDashboardOverview(params: Parameters<typeof adminOpsQueryDatasource.getDashboardOverview>[0], options?: { signal?: AbortSignal }): Promise<OpsDashboardOverview> {
    return (await this.ds.getDashboardOverview(params, options ?? {})).toEntity()
  }

  async getDashboardSnapshotV2(params: Parameters<typeof adminOpsQueryDatasource.getDashboardSnapshotV2>[0], options?: { signal?: AbortSignal }): Promise<OpsDashboardSnapshotV2> {
    return (await this.ds.getDashboardSnapshotV2(params, options ?? {})).toEntity()
  }

  async getThroughputTrend(params: Parameters<typeof adminOpsQueryDatasource.getThroughputTrend>[0], options?: { signal?: AbortSignal }): Promise<OpsThroughputTrendResponse> {
    return (await this.ds.getThroughputTrend(params, options ?? {})).toEntity()
  }

  async getLatencyHistogram(params: Parameters<typeof adminOpsQueryDatasource.getLatencyHistogram>[0], options?: { signal?: AbortSignal }): Promise<OpsLatencyHistogramResponse> {
    return (await this.ds.getLatencyHistogram(params, options ?? {})).toEntity()
  }

  async getErrorTrend(params: Parameters<typeof adminOpsQueryDatasource.getErrorTrend>[0], options?: { signal?: AbortSignal }): Promise<OpsErrorTrendResponse> {
    return (await this.ds.getErrorTrend(params, options ?? {})).toEntity()
  }

  async getErrorDistribution(params: Parameters<typeof adminOpsQueryDatasource.getErrorDistribution>[0], options?: { signal?: AbortSignal }): Promise<OpsErrorDistributionResponse> {
    return (await this.ds.getErrorDistribution(params, options ?? {})).toEntity()
  }

  async getImageGenerationStats(params: Parameters<typeof adminOpsQueryDatasource.getImageGenerationStats>[0], options?: { signal?: AbortSignal }): Promise<OpsImageGenerationStats> {
    return (await this.ds.getImageGenerationStats(params, options ?? {})).toEntity()
  }

  async getOpenAITokenStats(params: Parameters<typeof adminOpsQueryDatasource.getOpenAITokenStats>[0], options?: { signal?: AbortSignal }): Promise<OpsOpenAITokenStats> {
    return (await this.ds.getOpenAITokenStats(params, options ?? {})).toEntity()
  }

  async getUserUsageStats(params: Parameters<typeof adminOpsQueryDatasource.getUserUsageStats>[0], options?: { signal?: AbortSignal }): Promise<OpsUserUsageStats> {
    return (await this.ds.getUserUsageStats(params, options ?? {})).toEntity()
  }

  async listErrorLogs(params: Parameters<typeof adminOpsQueryDatasource.listErrorLogs>[0]): Promise<PaginatedResponse<OpsErrorLog>> {
    const result = await this.ds.listErrorLogs(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getErrorLogDetail(id: number): Promise<OpsErrorDetail> {
    return (await this.ds.getErrorLogDetail(id)).toEntity()
  }

  async listRequestErrors(params: Parameters<typeof adminOpsQueryDatasource.listRequestErrors>[0]): Promise<PaginatedResponse<OpsErrorLog>> {
    const result = await this.ds.listRequestErrors(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async listUpstreamErrors(params: Parameters<typeof adminOpsQueryDatasource.listUpstreamErrors>[0]): Promise<PaginatedResponse<OpsErrorLog>> {
    const result = await this.ds.listUpstreamErrors(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getRequestErrorDetail(id: number): Promise<OpsErrorDetail> {
    return (await this.ds.getRequestErrorDetail(id)).toEntity()
  }

  async getUpstreamErrorDetail(id: number): Promise<OpsErrorDetail> {
    return (await this.ds.getUpstreamErrorDetail(id)).toEntity()
  }

  async listRequestErrorUpstreamErrors(id: number, params = {}, options = {}): Promise<PaginatedResponse<OpsErrorDetail>> {
    const result = await this.ds.listRequestErrorUpstreamErrors(id, params, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async listRequestDetails(params: Parameters<typeof adminOpsQueryDatasource.listRequestDetails>[0]): Promise<PaginatedResponse<unknown>> {
    return this.ds.listRequestDetails(params)
  }

  async listAlertRules(): Promise<AlertRule[]> {
    return (await this.ds.listAlertRules()).map(dto => dto.toEntity())
  }

  async listAlertEvents(params = {}): Promise<AlertEvent[]> {
    return (await this.ds.listAlertEvents(params)).map(dto => dto.toEntity())
  }

  async getAlertEvent(id: number): Promise<AlertEvent> {
    return (await this.ds.getAlertEvent(id)).toEntity()
  }

  async getEmailNotificationConfig(): Promise<EmailNotificationConfig> {
    return (await this.ds.getEmailNotificationConfig()).toEntity()
  }

  async getSettingsSnapshot(): Promise<unknown> {
    return this.ds.getSettingsSnapshot()
  }

  async getAlertRuntimeSettings(): Promise<OpsAlertRuntimeSettings> {
    return (await this.ds.getAlertRuntimeSettings()).toEntity()
  }

  async getRuntimeLogConfig(): Promise<OpsRuntimeLogConfig> {
    return (await this.ds.getRuntimeLogConfig()).toEntity()
  }

  async listSystemLogs(params: Parameters<typeof adminOpsQueryDatasource.listSystemLogs>[0]): Promise<PaginatedResponse<OpsSystemLog>> {
    const result = await this.ds.listSystemLogs(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getSystemLogSinkHealth(): Promise<OpsSystemLogSinkHealth> {
    return (await this.ds.getSystemLogSinkHealth()).toEntity()
  }

  async getAdvancedSettings(): Promise<OpsAdvancedSettings> {
    return (await this.ds.getAdvancedSettings()).toEntity()
  }
}

export const adminOpsQueryRepository: AdminOpsQueryRepository = new AdminOpsQueryRepositoryImpl()
