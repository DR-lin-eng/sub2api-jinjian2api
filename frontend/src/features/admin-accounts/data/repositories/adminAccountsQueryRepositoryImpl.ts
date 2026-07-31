import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { adminAccountsQueryDatasource } from '@/features/admin-accounts/data/datasources/adminAccountsQueryDatasource'
import type { OpenAIQuotaUsage } from '@/features/admin-accounts/domain/models/openAIQuotaUsage'
import type { ClaudeModel } from '@/features/admin-accounts/domain/models/claudeModel'
import type { Account } from '@/core/models/domain/account'
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

  list = async (
    page: number = 1,
    pageSize: number = 20,
    filters?: Parameters<typeof adminAccountsQueryDatasource.list>[2],
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Account>> => {
    const dtoPage = await this.ds.list(page, pageSize, filters, options)
    return { ...dtoPage, items: dtoPage.items.map(dto => dto.toEntity()) }
  }

  listWithEtag = async (
    page: number = 1,
    pageSize: number = 20,
    filters?: Parameters<typeof adminAccountsQueryDatasource.listWithEtag>[2],
    options?: { signal?: AbortSignal; etag?: string | null },
  ): Promise<AccountListWithEtagResult> => {
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

  getById = async (id: number) : Promise<Account>  => {
    return (await this.ds.getById(id)).toEntity()
  }

  getStats = async (id: number, days: number = 30) : Promise<AccountUsageStatsResponse>  => {
    return (await this.ds.getStats(id, days)).toEntity()
  }

  getUsage = async (id: number, source?: 'passive' | 'active', force?: boolean) : Promise<AccountUsageInfo>  => {
    return (await this.ds.getUsage(id, source, force)).toEntity()
  }

  getTempUnschedulableStatus = async (id: number) : Promise<TempUnschedulableStatus>  => {
    return (await this.ds.getTempUnschedulableStatus(id)).toEntity()
  }

  getTodayStats = async (id: number) : Promise<WindowStats>  => {
    return (await this.ds.getTodayStats(id)).toEntity()
  }

  getAvailableModels = async (id: number) : Promise<ClaudeModel[]>  => {
    return this.ds.getAvailableModels(id)
  }

  exportData = async (options?: Parameters<typeof adminAccountsQueryDatasource.exportData>[0]) : Promise<AdminDataPayload>  => {
    return (await this.ds.exportData(options)).toEntity()
  }

  getAntigravityDefaultModelMapping = async () : Promise<Record<string, string>>  => {
    return this.ds.getAntigravityDefaultModelMapping()
  }

  queryOpenAIQuota = async (id: number) : Promise<OpenAIQuotaUsage>  => {
    return (await this.ds.queryOpenAIQuota(id)).toEntity()
  }

  getUpstreamBillingProbeSettings = async () : Promise<UpstreamBillingProbeSettings>  => {
    return (await this.ds.getUpstreamBillingProbeSettings()).toEntity()
  }
}

export const adminAccountsQueryRepository: AdminAccountsQueryRepository = new AdminAccountsQueryRepositoryImpl()
