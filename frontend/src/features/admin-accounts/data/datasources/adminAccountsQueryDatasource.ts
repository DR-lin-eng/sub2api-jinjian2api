/**
 * Admin Accounts Query Datasource (GET only, per §5.1 R1)
 * Returns DTO instances (via Dto.fromJson) — never Entity.
 */

import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AccountDto } from '@/core/models/data/accountDto'
import { AccountUsageInfoDto } from '@/features/admin-accounts/data/models/accountUsageInfoDto'
import { WindowStatsDto } from '@/features/admin-accounts/data/models/windowStatsDto'
import { TempUnschedulableStatusDto } from '@/features/admin-accounts/data/models/tempUnschedulableStatusDto'
import { UpstreamBillingProbeSettingsDto } from '@/features/admin-accounts/data/models/upstreamBillingProbeSettingsDto'
import { AccountUsageStatsResponseDto } from '@/features/admin-accounts/data/models/accountUsageStatsResponseDto'
import { AdminDataPayloadDto } from '@/features/admin-accounts/data/models/adminDataPayloadDto'
import { OpenAIQuotaUsageDto } from '@/features/admin-accounts/data/models/openAIQuotaUsageDto'
import type { ClaudeModel } from '@/features/admin-accounts/domain/models/claudeModel'
// ==================== Query-side response types ====================

export interface AccountListWithEtagResultDto {
  notModified: boolean
  etag: string | null
  data: PaginatedResponse<AccountDto> | null
}

// ==================== Query Datasource ====================

export class AdminAccountsQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      platform?: string
      type?: string
      status?: string
      group?: string
      search?: string
      privacy_mode?: string
      lite?: string
      include_scheduler_score?: string
      include_hourly_usage?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AccountDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/accounts', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => AccountDto.fromJson(item)) }
  }

  async listWithEtag(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      platform?: string
      type?: string
      status?: string
      group?: string
      search?: string
      privacy_mode?: string
      lite?: string
      include_scheduler_score?: string
      include_hourly_usage?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal; etag?: string | null },
  ): Promise<AccountListWithEtagResultDto> {
    const headers: Record<string, string> = {}
    if (options?.etag) {
      headers['If-None-Match'] = options.etag
    }

    const response = await apiClient.get<PaginatedResponse<unknown>>('/admin/accounts', {
      params: { page, page_size: pageSize, ...filters },
      headers,
      signal: options?.signal,
      validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
    })

    const etagHeader = typeof response.headers?.etag === 'string' ? response.headers.etag : null
    if (response.status === 304) {
      return { notModified: true, etag: etagHeader, data: null }
    }
    const raw = response.data
    return {
      notModified: false,
      etag: etagHeader,
      data: { ...raw, items: (raw.items ?? []).map(item => AccountDto.fromJson(item)) },
    }
  }

  async getById(id: number): Promise<AccountDto> {
    const { data } = await apiClient.get<unknown>(`/admin/accounts/${id}`)
    return AccountDto.fromJson(data)
  }

  async getStats(id: number, days: number = 30): Promise<AccountUsageStatsResponseDto> {
    const { data } = await apiClient.get<unknown>(`/admin/accounts/${id}/stats`, {
      params: { days },
    })
    return AccountUsageStatsResponseDto.fromJson(data)
  }

  async getUsage(id: number, source?: 'passive' | 'active', force?: boolean): Promise<AccountUsageInfoDto> {
    const params: Record<string, string> = {}
    if (source) params.source = source
    if (force) params.force = 'true'
    const { data } = await apiClient.get<unknown>(`/admin/accounts/${id}/usage`, {
      params: Object.keys(params).length > 0 ? params : undefined,
    })
    return AccountUsageInfoDto.fromJson(data)
  }

  async getTempUnschedulableStatus(id: number): Promise<TempUnschedulableStatusDto> {
    const { data } = await apiClient.get<unknown>(`/admin/accounts/${id}/temp-unschedulable`)
    return TempUnschedulableStatusDto.fromJson(data)
  }

  async getTodayStats(id: number): Promise<WindowStatsDto> {
    const { data } = await apiClient.get<unknown>(`/admin/accounts/${id}/today-stats`)
    return WindowStatsDto.fromJson(data)
  }

  async getAvailableModels(id: number): Promise<ClaudeModel[]> {
    const { data } = await apiClient.get<ClaudeModel[]>(`/admin/accounts/${id}/models`)
    return data
  }

  async exportData(options?: {
    ids?: number[]
    filters?: {
      platform?: string
      type?: string
      status?: string
      group?: string
      privacy_mode?: string
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    }
    includeProxies?: boolean
  }): Promise<AdminDataPayloadDto> {
    const params: Record<string, string> = {}
    if (options?.ids && options.ids.length > 0) {
      params.ids = options.ids.join(',')
    } else if (options?.filters) {
      const { platform, type, status, group, privacy_mode, search, sort_by, sort_order } = options.filters
      if (platform) params.platform = platform
      if (type) params.type = type
      if (status) params.status = status
      if (group) params.group = group
      if (privacy_mode) params.privacy_mode = privacy_mode
      if (search) params.search = search
      if (sort_by) params.sort_by = sort_by
      if (sort_order) params.sort_order = sort_order
    }
    if (options?.includeProxies === false) {
      params.include_proxies = 'false'
    }
    const { data } = await apiClient.get<unknown>('/admin/accounts/data', { params })
    return AdminDataPayloadDto.fromJson(data)
  }

  async getAntigravityDefaultModelMapping(): Promise<Record<string, string>> {
    const { data } = await apiClient.get<Record<string, string>>(
      '/admin/accounts/antigravity/default-model-mapping',
    )
    return data
  }

  async queryOpenAIQuota(id: number): Promise<OpenAIQuotaUsageDto> {
    const { data } = await apiClient.get<unknown>(`/admin/openai/accounts/${id}/quota`)
    return OpenAIQuotaUsageDto.fromJson(data)
  }

  async getUpstreamBillingProbeSettings(): Promise<UpstreamBillingProbeSettingsDto> {
    const { data } = await apiClient.get<unknown>('/admin/accounts/upstream-billing-probe/settings')
    return UpstreamBillingProbeSettingsDto.fromJson(data)
  }
}

export const adminAccountsQueryDatasource = new AdminAccountsQueryDatasource()
