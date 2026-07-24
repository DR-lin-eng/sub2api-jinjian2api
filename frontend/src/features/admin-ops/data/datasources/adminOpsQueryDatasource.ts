import { apiClient, buildGatewayUrl } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { OpsDashboardQueryParams, OpsDashboardSnapshotV2Params } from '@/features/admin-ops/data/requests_models/opsDashboardQueryParams'
import type { OpsErrorListQueryParams } from '@/features/admin-ops/data/requests_models/opsErrorListQueryParams'
import type { OpsRequestDetailsParams } from '@/features/admin-ops/data/requests_models/opsRequestDetailsParams'
import type { OpsSystemLogQuery } from '@/features/admin-ops/data/requests_models/opsSystemLogQuery'
import type { AlertEventsQuery } from '@/features/admin-ops/data/requests_models/alertEventsQuery'
import type { OpsImageGenerationStatsParams } from '@/features/admin-ops/data/requests_models/opsImageGenerationStatsParams'
import type { OpsOpenAITokenStatsParams } from '@/features/admin-ops/data/requests_models/opsOpenAITokenStatsParams'
import type { OpsUserUsageStatsParams } from '@/features/admin-ops/data/requests_models/opsUserUsageStatsParams'
import type { SubscribeQPSOptions } from '@/features/admin-ops/data/requests_models/subscribeQpsOptions'
import { OpsDashboardOverviewDto } from '@/features/admin-ops/data/models/opsDashboardOverviewDto'
import { OpsDashboardSnapshotV2Dto } from '@/features/admin-ops/data/models/opsDashboardSnapshotV2Dto'
import { OpsThroughputTrendResponseDto } from '@/features/admin-ops/data/models/opsThroughputTrendResponseDto'
import { OpsLatencyHistogramResponseDto } from '@/features/admin-ops/data/models/opsLatencyHistogramResponseDto'
import { OpsErrorTrendResponseDto } from '@/features/admin-ops/data/models/opsErrorTrendResponseDto'
import { OpsErrorDistributionResponseDto } from '@/features/admin-ops/data/models/opsErrorDistributionResponseDto'
import { OpsImageGenerationStatsDto } from '@/features/admin-ops/data/models/opsImageGenerationStatsDto'
import { OpsOpenAITokenStatsDto } from '@/features/admin-ops/data/models/opsOpenAITokenStatsDto'
import { OpsUserUsageStatsDto } from '@/features/admin-ops/data/models/opsUserUsageStatsDto'
import { OpsConcurrencyStatsDto } from '@/features/admin-ops/data/models/opsConcurrencyStatsDto'
import { OpsUserConcurrencyStatsDto } from '@/features/admin-ops/data/models/opsUserConcurrencyStatsDto'
import { OpsAccountAvailabilityStatsDto } from '@/features/admin-ops/data/models/opsAccountAvailabilityStatsDto'
import { OpsRealtimeTrafficSummaryResponseDto } from '@/features/admin-ops/data/models/opsRealtimeTrafficSummaryDto'
import { OpsErrorLogDto } from '@/features/admin-ops/data/models/opsErrorLogDto'
import { OpsErrorDetailDto } from '@/features/admin-ops/data/models/opsErrorDetailDto'
import { AlertRuleDto } from '@/features/admin-ops/data/models/alertRuleDto'
import { AlertEventDto } from '@/features/admin-ops/data/models/alertEventDto'
import { EmailNotificationConfigDto } from '@/features/admin-ops/data/models/emailNotificationConfigDto'
import { OpsAlertRuntimeSettingsDto } from '@/features/admin-ops/data/models/opsAlertRuntimeSettingsDto'
import { OpsRuntimeLogConfigDto } from '@/features/admin-ops/data/models/opsRuntimeLogConfigDto'
import { OpsAdvancedSettingsDto } from '@/features/admin-ops/data/models/opsAdvancedSettingsDto'
import { OpsSystemLogDto } from '@/features/admin-ops/data/models/opsSystemLogDto'
import { OpsSystemLogSinkHealthDto } from '@/features/admin-ops/data/models/opsSystemLogSinkHealthDto'

export type OpsWSStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'closed'
export const OPS_WS_CLOSE_CODES = { REALTIME_DISABLED: 4001 } as const
const OPS_WS_BASE_PROTOCOL = 'sub2api-admin'

export class AdminOpsQueryDatasource {
  subscribeQPS(onMessage: (data: unknown) => void, options: SubscribeQPSOptions = {}): () => void {
    let ws: WebSocket | null = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = Number.isFinite(options.maxReconnectAttempts as number) ? (options.maxReconnectAttempts as number) : Infinity
    const baseDelayMs = options.reconnectBaseDelayMs ?? 1000
    const maxDelayMs = options.reconnectMaxDelayMs ?? 30000
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let shouldReconnect = true
    let isConnecting = false
    let hasConnectedOnce = false
    let lastMessageAt = 0
    const staleTimeoutMs = options.staleTimeoutMs ?? 120_000
    const staleCheckIntervalMs = options.staleCheckIntervalMs ?? 30_000
    let staleTimer: ReturnType<typeof setInterval> | null = null

    const setStatus = (s: OpsWSStatus) => { options.onStatusChange?.(s) }
    const clearReconnectTimer = () => { if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null } }
    const clearStaleTimer = () => { if (staleTimer) { clearInterval(staleTimer); staleTimer = null } }
    const startStaleTimer = () => {
      clearStaleTimer()
      if (!staleTimeoutMs || staleTimeoutMs <= 0) return
      staleTimer = setInterval(() => {
        if (!shouldReconnect || !ws || ws.readyState !== WebSocket.OPEN || !lastMessageAt) return
        if (Date.now() - lastMessageAt > staleTimeoutMs) ws.close()
      }, staleCheckIntervalMs)
    }
    const scheduleReconnect = () => {
      if (!shouldReconnect || (hasConnectedOnce && reconnectAttempts >= maxReconnectAttempts)) return
      if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) { setStatus('offline'); return }
      const delay = Math.min(baseDelayMs * Math.pow(2, reconnectAttempts), maxDelayMs) + Math.floor(Math.random() * 250)
      clearReconnectTimer()
      reconnectTimer = setTimeout(() => { reconnectAttempts++; connect() }, delay)
      options.onReconnectScheduled?.({ attempt: reconnectAttempts + 1, delayMs: delay })
    }
    const handleOnline = () => {
      if (!shouldReconnect || (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING))) return
      connect()
    }
    const handleOffline = () => { setStatus('offline') }
    const connect = () => {
      if (!shouldReconnect || isConnecting) return
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return
      if (hasConnectedOnce && reconnectAttempts >= maxReconnectAttempts) return
      isConnecting = true
      setStatus(hasConnectedOnce ? 'reconnecting' : 'connecting')
      const wsBaseUrl = options.wsBaseUrl || import.meta.env.VITE_WS_BASE_URL
      const wsURL = wsBaseUrl
        ? new URL(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${wsBaseUrl}/api/v1/admin/ops/ws/qps`)
        : new URL(buildGatewayUrl('/api/v1/admin/ops/ws/qps').replace(/^http/, 'ws'))
      const rawToken = String(options.token ?? localStorage.getItem('auth_token') ?? '').trim()
      const protocols: string[] = [OPS_WS_BASE_PROTOCOL]
      if (rawToken) protocols.push(`jwt.${rawToken}`)
      ws = new WebSocket(wsURL.toString(), protocols)
      ws.onopen = () => { reconnectAttempts = 0; isConnecting = false; hasConnectedOnce = true; clearReconnectTimer(); lastMessageAt = Date.now(); startStaleTimer(); setStatus('connected'); options.onOpen?.() }
      ws.onmessage = (e) => { try { lastMessageAt = Date.now(); onMessage(JSON.parse(e.data)) } catch (err) { console.warn('[OpsWS] Failed to parse message:', err) } }
      ws.onerror = (error) => { console.error('[OpsWS] Connection error:', error); options.onError?.(error) }
      ws.onclose = (event) => {
        isConnecting = false; options.onClose?.(event); clearStaleTimer(); ws = null
        if (event?.code === OPS_WS_CLOSE_CODES.REALTIME_DISABLED) { shouldReconnect = false; clearReconnectTimer(); setStatus('closed'); options.onFatalClose?.(event); return }
        scheduleReconnect()
      }
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    connect()
    return () => {
      shouldReconnect = false
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearReconnectTimer(); clearStaleTimer()
      if (ws) ws.close()
      ws = null; setStatus('closed')
    }
  }

  async getConcurrencyStats(platform?: string, groupId?: number | null): Promise<OpsConcurrencyStatsDto> {
    const params: Record<string, unknown> = {}
    if (platform) params.platform = platform
    if (typeof groupId === 'number' && groupId > 0) params.group_id = groupId
    const { data } = await apiClient.get<unknown>('/admin/ops/concurrency', { params })
    return OpsConcurrencyStatsDto.fromJson(data)
  }

  async getUserConcurrencyStats(): Promise<OpsUserConcurrencyStatsDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/user-concurrency')
    return OpsUserConcurrencyStatsDto.fromJson(data)
  }

  async getAccountAvailabilityStats(platform?: string, groupId?: number | null): Promise<OpsAccountAvailabilityStatsDto> {
    const params: Record<string, unknown> = {}
    if (platform) params.platform = platform
    if (typeof groupId === 'number' && groupId > 0) params.group_id = groupId
    const { data } = await apiClient.get<unknown>('/admin/ops/account-availability', { params })
    return OpsAccountAvailabilityStatsDto.fromJson(data)
  }

  async getRealtimeTrafficSummary(window: string, platform?: string, groupId?: number | null): Promise<OpsRealtimeTrafficSummaryResponseDto> {
    const params: Record<string, unknown> = { window }
    if (platform) params.platform = platform
    if (typeof groupId === 'number' && groupId > 0) params.group_id = groupId
    const { data } = await apiClient.get<unknown>('/admin/ops/realtime-traffic', { params })
    return OpsRealtimeTrafficSummaryResponseDto.fromJson(data)
  }

  async getDashboardOverview(params: OpsDashboardQueryParams, options: { signal?: AbortSignal } = {}): Promise<OpsDashboardOverviewDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/overview', { params, signal: options.signal })
    return OpsDashboardOverviewDto.fromJson(data)
  }

  async getDashboardSnapshotV2(params: OpsDashboardSnapshotV2Params, options: { signal?: AbortSignal } = {}): Promise<OpsDashboardSnapshotV2Dto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/snapshot-v2', { params, signal: options.signal })
    return OpsDashboardSnapshotV2Dto.fromJson(data)
  }

  async getThroughputTrend(params: OpsDashboardQueryParams, options: { signal?: AbortSignal } = {}): Promise<OpsThroughputTrendResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/throughput-trend', { params, signal: options.signal })
    return OpsThroughputTrendResponseDto.fromJson(data)
  }

  async getLatencyHistogram(params: OpsDashboardQueryParams, options: { signal?: AbortSignal } = {}): Promise<OpsLatencyHistogramResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/latency-histogram', { params, signal: options.signal })
    return OpsLatencyHistogramResponseDto.fromJson(data)
  }

  async getErrorTrend(params: OpsDashboardQueryParams, options: { signal?: AbortSignal } = {}): Promise<OpsErrorTrendResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/error-trend', { params, signal: options.signal })
    return OpsErrorTrendResponseDto.fromJson(data)
  }

  async getErrorDistribution(params: OpsDashboardQueryParams, options: { signal?: AbortSignal } = {}): Promise<OpsErrorDistributionResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/error-distribution', { params, signal: options.signal })
    return OpsErrorDistributionResponseDto.fromJson(data)
  }

  async getImageGenerationStats(params: OpsImageGenerationStatsParams, options: { signal?: AbortSignal } = {}): Promise<OpsImageGenerationStatsDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/image-generation-stats', { params, signal: options.signal })
    return OpsImageGenerationStatsDto.fromJson(data)
  }

  async getOpenAITokenStats(params: OpsOpenAITokenStatsParams, options: { signal?: AbortSignal } = {}): Promise<OpsOpenAITokenStatsDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/openai-token-stats', { params, signal: options.signal })
    return OpsOpenAITokenStatsDto.fromJson(data)
  }

  async getUserUsageStats(params: OpsUserUsageStatsParams, options: { signal?: AbortSignal } = {}): Promise<OpsUserUsageStatsDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/dashboard/user-usage-stats', { params, signal: options.signal })
    return OpsUserUsageStatsDto.fromJson(data)
  }

  async listErrorLogs(params: OpsErrorListQueryParams): Promise<PaginatedResponse<OpsErrorLogDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/ops/errors', { params })
    return { ...data, items: (data.items ?? []).map(item => OpsErrorLogDto.fromJson(item)) }
  }

  async getErrorLogDetail(id: number): Promise<OpsErrorDetailDto> {
    const { data } = await apiClient.get<unknown>(`/admin/ops/errors/${id}`)
    return OpsErrorDetailDto.fromJson(data)
  }

  async listRequestErrors(params: OpsErrorListQueryParams): Promise<PaginatedResponse<OpsErrorLogDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/ops/request-errors', { params })
    return { ...data, items: (data.items ?? []).map(item => OpsErrorLogDto.fromJson(item)) }
  }

  async listUpstreamErrors(params: OpsErrorListQueryParams): Promise<PaginatedResponse<OpsErrorLogDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/ops/upstream-errors', { params })
    return { ...data, items: (data.items ?? []).map(item => OpsErrorLogDto.fromJson(item)) }
  }

  async getRequestErrorDetail(id: number): Promise<OpsErrorDetailDto> {
    const { data } = await apiClient.get<unknown>(`/admin/ops/request-errors/${id}`)
    return OpsErrorDetailDto.fromJson(data)
  }

  async getUpstreamErrorDetail(id: number): Promise<OpsErrorDetailDto> {
    const { data } = await apiClient.get<unknown>(`/admin/ops/upstream-errors/${id}`)
    return OpsErrorDetailDto.fromJson(data)
  }

  async listRequestErrorUpstreamErrors(id: number, params: OpsErrorListQueryParams = {}, options: { include_detail?: boolean } = {}): Promise<PaginatedResponse<OpsErrorDetailDto>> {
    const query: Record<string, unknown> = { ...params }
    if (options.include_detail) query.include_detail = '1'
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(`/admin/ops/request-errors/${id}/upstream-errors`, { params: query })
    return { ...data, items: (data.items ?? []).map(item => OpsErrorDetailDto.fromJson(item)) }
  }

  async listRequestDetails(params: OpsRequestDetailsParams): Promise<PaginatedResponse<unknown>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/ops/requests', { params })
    return data
  }

  async listAlertRules(): Promise<AlertRuleDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/ops/alert-rules')
    return data.map(item => AlertRuleDto.fromJson(item))
  }

  async listAlertEvents(params: AlertEventsQuery = {}): Promise<AlertEventDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/ops/alert-events', { params })
    return data.map(item => AlertEventDto.fromJson(item))
  }

  async getAlertEvent(id: number): Promise<AlertEventDto> {
    const { data } = await apiClient.get<unknown>(`/admin/ops/alert-events/${id}`)
    return AlertEventDto.fromJson(data)
  }

  async getEmailNotificationConfig(): Promise<EmailNotificationConfigDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/email-notification/config')
    return EmailNotificationConfigDto.fromJson(data)
  }

  async getSettingsSnapshot(): Promise<unknown> {
    const { data } = await apiClient.get<unknown>('/admin/ops/settings/snapshot')
    return data
  }

  async getAlertRuntimeSettings(): Promise<OpsAlertRuntimeSettingsDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/runtime/alert')
    return OpsAlertRuntimeSettingsDto.fromJson(data)
  }

  async getRuntimeLogConfig(): Promise<OpsRuntimeLogConfigDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/runtime/logging')
    return OpsRuntimeLogConfigDto.fromJson(data)
  }

  async listSystemLogs(params: OpsSystemLogQuery): Promise<PaginatedResponse<OpsSystemLogDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/ops/system-logs', { params })
    return { ...data, items: (data.items ?? []).map(item => OpsSystemLogDto.fromJson(item)) }
  }

  async getSystemLogSinkHealth(): Promise<OpsSystemLogSinkHealthDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/system-logs/health')
    return OpsSystemLogSinkHealthDto.fromJson(data)
  }

  async getAdvancedSettings(): Promise<OpsAdvancedSettingsDto> {
    const { data } = await apiClient.get<unknown>('/admin/ops/advanced-settings')
    return OpsAdvancedSettingsDto.fromJson(data)
  }
}

export const adminOpsQueryDatasource = new AdminOpsQueryDatasource()
