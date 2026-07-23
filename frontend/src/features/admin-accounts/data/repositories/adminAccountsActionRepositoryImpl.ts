import { adminAccountsActionDatasource } from '@/features/admin-accounts/data/datasources/adminAccountsActionDatasource'
import type { CodexSessionImportRequest, OpenAICodexPATCreateRequest } from '@/types'
import type { Account } from '@/features/admin-accounts/domain/models/account'
import type { CreateAccountRequest } from '@/features/admin-accounts/data/requests_models/createAccountRequest'
import type { UpdateAccountRequest } from '@/features/admin-accounts/data/requests_models/updateAccountRequest'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'
import type { CodexSessionImportResult } from '@/features/admin-accounts/domain/models/codexSessionImportResult'
import type { CheckMixedChannelRequest } from '@/features/admin-accounts/data/requests_models/checkMixedChannelRequest'
import type { CheckMixedChannelResponse } from '@/features/admin-accounts/domain/models/checkMixedChannelResponse'
import type { UpstreamBillingProbeResult } from '@/features/admin-accounts/domain/models/upstreamBillingProbeResult'
import type { UpstreamBillingProbeSettings } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSettings'
import type { BatchTodayStatsResponse } from '@/features/admin-accounts/domain/models/batchTodayStatsResponse'
import type { OpenAIQuotaResetResult } from '@/features/admin-accounts/domain/models/openAIQuotaResetResult'
import type {
  AdminAccountsActionRepository,
  AccountSummary,
  SyncUpstreamModelsResult,
  SyncUpstreamPreviewParams,
  PreviewFromCRSResult,
  SyncFromCRSResult,
  BatchOperationResult,
  BatchCreateResult,
  BatchUpdateCredentialsRequest,
  BatchUpdateCredentialsResult,
  BulkUpdateResult,
  TestAccountResult,
  OAuthAuthUrlResponse,
  ApplyOAuthCredentialsPayload,
} from '@/features/admin-accounts/domain/repositories/adminAccountsActionRepository'

export class AdminAccountsActionRepositoryImpl implements AdminAccountsActionRepository {
  private readonly ds = adminAccountsActionDatasource

  async getBatchSummaries(accountIds: number[]): Promise<AccountSummary[]> {
    return this.ds.getBatchSummaries(accountIds)
  }

  async create(accountData: CreateAccountRequest): Promise<Account> {
    return (await this.ds.create(accountData)).toEntity()
  }

  async duplicate(id: number): Promise<Account> {
    return (await this.ds.duplicate(id)).toEntity()
  }

  async update(id: number, updates: UpdateAccountRequest): Promise<Account> {
    return (await this.ds.update(id, updates)).toEntity()
  }

  async checkMixedChannelRisk(payload: CheckMixedChannelRequest): Promise<CheckMixedChannelResponse> {
    return (await this.ds.checkMixedChannelRisk(payload)).toEntity()
  }

  async deleteAccount(id: number): Promise<{ message: string }> {
    return this.ds.deleteAccount(id)
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<Account> {
    return this.update(id, { status })
  }

  async testAccount(id: number): Promise<TestAccountResult> {
    return this.ds.testAccount(id)
  }

  async refreshCredentials(id: number): Promise<Account> {
    return (await this.ds.refreshCredentials(id)).toEntity()
  }

  async applyOAuthCredentials(id: number, payload: ApplyOAuthCredentialsPayload): Promise<Account> {
    return (await this.ds.applyOAuthCredentials(id, payload)).toEntity()
  }

  async clearError(id: number): Promise<Account> {
    return (await this.ds.clearError(id)).toEntity()
  }

  async clearRateLimit(id: number): Promise<Account> {
    return (await this.ds.clearRateLimit(id)).toEntity()
  }

  async recoverState(id: number): Promise<Account> {
    return (await this.ds.recoverState(id)).toEntity()
  }

  async resetAccountQuota(id: number): Promise<Account> {
    return (await this.ds.resetAccountQuota(id)).toEntity()
  }

  async resetTempUnschedulable(id: number): Promise<{ message: string }> {
    return this.ds.resetTempUnschedulable(id)
  }

  async generateAuthUrl(endpoint: string, config: { proxy_id?: number }): Promise<OAuthAuthUrlResponse> {
    const dto = await this.ds.generateAuthUrl(endpoint, { proxyId: config.proxy_id })
    return { auth_url: dto.auth_url, session_id: dto.session_id }
  }

  async exchangeCode(
    endpoint: string,
    exchangeData: { session_id: string; code: string; state?: string; proxy_id?: number },
  ): Promise<Record<string, unknown>> {
    return this.ds.exchangeCode(endpoint, {
      sessionId: exchangeData.session_id,
      code: exchangeData.code,
      state: exchangeData.state,
      proxyId: exchangeData.proxy_id,
    })
  }

  async batchCreate(accounts: CreateAccountRequest[]): Promise<BatchCreateResult> {
    const dto = await this.ds.batchCreate(accounts)
    return {
      success: dto.success,
      failed: dto.failed,
      results: dto.results.map(r => ({
        success: r.success,
        account: r.account ? r.account.toEntity() : undefined,
        error: r.error,
      })),
    }
  }

  async batchUpdateCredentials(request: BatchUpdateCredentialsRequest): Promise<BatchUpdateCredentialsResult> {
    return this.ds.batchUpdateCredentials({
      accountIds: request.account_ids,
      field: request.field,
      value: request.value,
    })
  }

  async bulkUpdate(
    accountIdsOrPayload: number[] | Record<string, unknown>,
    updates?: Record<string, unknown>,
  ): Promise<BulkUpdateResult> {
    return this.ds.bulkUpdate(accountIdsOrPayload, updates)
  }

  async getBatchTodayStats(accountIds: number[]): Promise<BatchTodayStatsResponse> {
    return (await this.ds.getBatchTodayStats(accountIds)).toEntity()
  }

  async setSchedulable(id: number, schedulable: boolean): Promise<Account> {
    return (await this.ds.setSchedulable(id, schedulable)).toEntity()
  }

  async syncUpstreamModels(id: number): Promise<SyncUpstreamModelsResult> {
    return this.ds.syncUpstreamModels(id)
  }

  async syncUpstreamModelsPreview(params: SyncUpstreamPreviewParams): Promise<SyncUpstreamModelsResult> {
    return this.ds.syncUpstreamModelsPreview({
      platform: params.platform,
      type: params.type,
      baseUrl: params.base_url,
      apiKey: params.api_key,
    })
  }

  async previewFromCrs(params: { base_url: string; username: string; password: string }): Promise<PreviewFromCRSResult> {
    return this.ds.previewFromCrs({
      baseUrl: params.base_url,
      username: params.username,
      password: params.password,
    })
  }

  async syncFromCrs(params: {
    base_url: string
    username: string
    password: string
    sync_proxies?: boolean
    selected_account_ids?: string[]
  }): Promise<SyncFromCRSResult> {
    return this.ds.syncFromCrs({
      baseUrl: params.base_url,
      username: params.username,
      password: params.password,
      syncProxies: params.sync_proxies,
      selectedAccountIds: params.selected_account_ids,
    })
  }

  async importData(payload: { data: AdminDataPayload; skip_default_group_bind?: boolean }): Promise<AdminDataImportResult> {
    return (await this.ds.importData({
      data: payload.data,
      skipDefaultGroupBind: payload.skip_default_group_bind,
    })).toEntity()
  }

  async importCodexSession(payload: CodexSessionImportRequest): Promise<CodexSessionImportResult> {
    return (await this.ds.importCodexSession(payload)).toEntity()
  }

  async createOpenAICodexPAT(payload: OpenAICodexPATCreateRequest): Promise<Account> {
    return (await this.ds.createOpenAICodexPAT(payload)).toEntity()
  }

  async refreshOpenAIToken(
    refreshToken: string,
    proxyId?: number | null,
    endpoint: string = '/admin/openai/refresh-token',
    clientId?: string,
  ): Promise<Record<string, unknown>> {
    return this.ds.refreshOpenAIToken(refreshToken, proxyId, endpoint, clientId)
  }

  async revertProxyFallback(id: number): Promise<{ message: string }> {
    return this.ds.revertProxyFallback(id)
  }

  async batchClearError(accountIds: number[]): Promise<BatchOperationResult> {
    return this.ds.batchClearError(accountIds)
  }

  async batchRefresh(accountIds: number[]): Promise<BatchOperationResult> {
    return this.ds.batchRefresh(accountIds)
  }

  async setPrivacy(id: number): Promise<Account> {
    return (await this.ds.setPrivacy(id)).toEntity()
  }

  async resetOpenAIQuota(id: number): Promise<OpenAIQuotaResetResult> {
    return (await this.ds.resetOpenAIQuota(id)).toEntity()
  }

  async createSparkShadow(
    parentId: number,
    payload: { name?: string; priority?: number; concurrency?: number; group_ids?: number[] },
  ): Promise<Account> {
    return (await this.ds.createSparkShadow(parentId, {
      name: payload.name,
      priority: payload.priority,
      concurrency: payload.concurrency,
      groupIds: payload.group_ids,
    })).toEntity()
  }

  async updateUpstreamBillingProbeSettings(settings: UpstreamBillingProbeSettings): Promise<UpstreamBillingProbeSettings> {
    return (await this.ds.updateUpstreamBillingProbeSettings(settings)).toEntity()
  }

  async setUpstreamBillingProbeEnabled(id: number, enabled: boolean): Promise<void> {
    await this.ds.setUpstreamBillingProbeEnabled(id, enabled)
  }

  async probeUpstreamBilling(id: number): Promise<UpstreamBillingProbeResult> {
    return (await this.ds.probeUpstreamBilling(id)).toEntity()
  }

  async probeUpstreamBillingBatch(accountIds: number[]): Promise<UpstreamBillingProbeResult[]> {
    const dtos = await this.ds.probeUpstreamBillingBatch(accountIds)
    return dtos.map(dto => dto.toEntity())
  }
}

export const adminAccountsActionRepository: AdminAccountsActionRepository = new AdminAccountsActionRepositoryImpl()
