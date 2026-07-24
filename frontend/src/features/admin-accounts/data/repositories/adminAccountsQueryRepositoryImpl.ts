import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { adminAccountsQueryDatasource } from '@/features/admin-accounts/data/datasources/adminAccountsQueryDatasource'
import type { OpenAIQuotaUsage } from '@/features/admin-accounts/domain/models/openAIQuotaUsage'
import type { ClaudeModel } from '@/features/admin-accounts/domain/models/claudeModel'
import type { Account } from '@/features/admin-accounts/domain/models/account'
import type { AccountUsageInfo } from '@/features/admin-accounts/domain/models/accountUsageInfo'
import type { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'
import type { AccountUsageStatsResponse } from '@/features/admin-accounts/domain/models/accountUsageStatsResponse'
import type { TempUnschedulableStatus } from '@/features/admin-accounts/domain/models/tempUnschedulableStatus'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { UpstreamBillingProbeSettings } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSettings'
import type {
  AdminAccountsQueryRepository,
  AccountListWithEtagResult,
} from '@/features/admin-accounts/domain/repositories/adminAccountsQueryRepository'

export class AdminAccountsQueryRepositoryImpl implements AdminAccountsQueryRepository {
  private readonly ds = adminAccountsQueryDatasource

  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: Parameters<typeof adminAccountsQueryDatasource.list>[2],
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Account>> {
    const dtoPage = await this.ds.list(page, pageSize, filters, options)
    return { ...dtoPage, items: dtoPage.items.map(dto => dto.toEntity()) }
  }

  async listWithEtag(
    page: number = 1,
    pageSize: number = 20,
    filters?: Parameters<typeof adminAccountsQueryDatasource.listWithEtag>[2],
    options?: { signal?: AbortSignal; etag?: string | null },
  ): Promise<AccountListWithEtagResult> {
    const result = await this.ds.listWithEtag(page, pageSize, filters, options)
    if (result.notModified || result.data === null) {
      return { notModified: result.notModified, etag: result.etag, data: null }
    }
    const dtoPage = result.data
    return {
      notModified: false,
      etag: result.etag,
      data: { ...dtoPage, items: dtoPage.items.map(dto => dto.toEntity()) },
    }
  }

  async getById(id: number): Promise<Account> {
    return (await this.ds.getById(id)).toEntity()
  }

  async getStats(id: number, days: number = 30): Promise<AccountUsageStatsResponse> {
    return (await this.ds.getStats(id, days)).toEntity()
  }

  async getUsage(id: number, source?: 'passive' | 'active', force?: boolean): Promise<AccountUsageInfo> {
    return (await this.ds.getUsage(id, source, force)).toEntity()
  }

  async getTempUnschedulableStatus(id: number): Promise<TempUnschedulableStatus> {
    return (await this.ds.getTempUnschedulableStatus(id)).toEntity()
  }

  async getTodayStats(id: number): Promise<WindowStats> {
    return (await this.ds.getTodayStats(id)).toEntity()
  }

  async getAvailableModels(id: number): Promise<ClaudeModel[]> {
    return this.ds.getAvailableModels(id)
  }

  async exportData(options?: Parameters<typeof adminAccountsQueryDatasource.exportData>[0]): Promise<AdminDataPayload> {
    return (await this.ds.exportData(options)).toEntity()
  }

  async getAntigravityDefaultModelMapping(): Promise<Record<string, string>> {
    return this.ds.getAntigravityDefaultModelMapping()
  }

  async queryOpenAIQuota(id: number): Promise<OpenAIQuotaUsage> {
    return (await this.ds.queryOpenAIQuota(id)).toEntity()
  }

  async getUpstreamBillingProbeSettings(): Promise<UpstreamBillingProbeSettings> {
    return (await this.ds.getUpstreamBillingProbeSettings()).toEntity()
  }
}

export const adminAccountsQueryRepository: AdminAccountsQueryRepository = new AdminAccountsQueryRepositoryImpl()
