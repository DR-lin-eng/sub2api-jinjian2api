import type { PaginatedResponse } from '@/types'
import type { ClaudeModel } from '@/types'
import type { Account } from '@/features/admin-accounts/domain/models/account'
import type { AccountUsageInfo } from '@/features/admin-accounts/domain/models/accountUsageInfo'
import type { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'
import type { AccountUsageStatsResponse } from '@/features/admin-accounts/domain/models/accountUsageStatsResponse'
import type { TempUnschedulableStatus } from '@/features/admin-accounts/domain/models/tempUnschedulableStatus'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { UpstreamBillingProbeSettings } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSettings'
import type { OpenAIQuotaUsage } from '@/features/admin-accounts/data/datasources/adminAccountsQueryDatasource'

export interface AccountListWithEtagResult {
  notModified: boolean
  etag: string | null
  data: PaginatedResponse<Account> | null
}

export interface AdminAccountsQueryRepository {
  list(
    page?: number,
    pageSize?: number,
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
  ): Promise<PaginatedResponse<Account>>
  listWithEtag(
    page?: number,
    pageSize?: number,
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
  ): Promise<AccountListWithEtagResult>
  getById(id: number): Promise<Account>
  getStats(id: number, days?: number): Promise<AccountUsageStatsResponse>
  getUsage(id: number, source?: 'passive' | 'active', force?: boolean): Promise<AccountUsageInfo>
  getTempUnschedulableStatus(id: number): Promise<TempUnschedulableStatus>
  getTodayStats(id: number): Promise<WindowStats>
  getAvailableModels(id: number): Promise<ClaudeModel[]>
  exportData(options?: {
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
  }): Promise<AdminDataPayload>
  getAntigravityDefaultModelMapping(): Promise<Record<string, string>>
  queryOpenAIQuota(id: number): Promise<OpenAIQuotaUsage>
  getUpstreamBillingProbeSettings(): Promise<UpstreamBillingProbeSettings>
}
