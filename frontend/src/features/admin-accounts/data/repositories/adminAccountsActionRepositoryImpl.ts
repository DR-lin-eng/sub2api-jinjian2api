import { adminAccountsActionDatasource } from '@/features/admin-accounts/data/datasources/adminAccountsActionDatasource'
import type { CodexSessionImportRequest } from '@/features/admin-accounts/data/requests_models/codexSessionImportRequest'
import type { OpenAICodexPATCreateRequest } from '@/features/admin-accounts/data/requests_models/openAICodexPATCreateRequest'
import type { Account } from '@/core/models/domain/account'
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

  getBatchSummaries = async (accountIds: number[]) : Promise<AccountSummary[]>  => {
    return this.ds.getBatchSummaries(accountIds)
  }

  create = async (accountData: CreateAccountRequest) : Promise<Account>  => {
    return (await this.ds.create(accountData)).toEntity()
  }

  duplicate = async (id: number) : Promise<Account>  => {
    return (await this.ds.duplicate(id)).toEntity()
  }

  update = async (id: number, updates: UpdateAccountRequest) : Promise<Account>  => {
    return (await this.ds.update(id, updates)).toEntity()
  }

  checkMixedChannelRisk = async (payload: CheckMixedChannelRequest) : Promise<CheckMixedChannelResponse>  => {
    return (await this.ds.checkMixedChannelRisk(payload)).toEntity()
  }

  deleteAccount = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteAccount(id)
  }

  toggleStatus = async (id: number, status: 'active' | 'inactive') : Promise<Account>  => {
    return this.update(id, { status })
  }

  testAccount = async (id: number) : Promise<TestAccountResult>  => {
    return this.ds.testAccount(id)
  }

  refreshCredentials = async (id: number) : Promise<Account>  => {
    return (await this.ds.refreshCredentials(id)).toEntity()
  }

  applyOAuthCredentials = async (id: number, payload: ApplyOAuthCredentialsPayload) : Promise<Account>  => {
    return (await this.ds.applyOAuthCredentials(id, payload)).toEntity()
  }

  clearError = async (id: number) : Promise<Account>  => {
    return (await this.ds.clearError(id)).toEntity()
  }

  clearRateLimit = async (id: number) : Promise<Account>  => {
    return (await this.ds.clearRateLimit(id)).toEntity()
  }

  recoverState = async (id: number) : Promise<Account>  => {
    return (await this.ds.recoverState(id)).toEntity()
  }

  resetAccountQuota = async (id: number) : Promise<Account>  => {
    return (await this.ds.resetAccountQuota(id)).toEntity()
  }

  resetTempUnschedulable = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.resetTempUnschedulable(id)
  }

  generateAuthUrl = async (endpoint: string, config: { proxy_id?: number }) : Promise<OAuthAuthUrlResponse>  => {
    const dto = await this.ds.generateAuthUrl(endpoint, { proxyId: config.proxy_id })
    return { auth_url: dto.auth_url, session_id: dto.session_id }
  }

  exchangeCode = async (
    endpoint: string,
    exchangeData: { session_id: string; code: string; state?: string; proxy_id?: number },
  ): Promise<Record<string, unknown>> => {
    return this.ds.exchangeCode(endpoint, {
      sessionId: exchangeData.session_id,
      code: exchangeData.code,
      state: exchangeData.state,
      proxyId: exchangeData.proxy_id,
    })
  }

  batchCreate = async (accounts: CreateAccountRequest[]) : Promise<BatchCreateResult>  => {
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

  batchUpdateCredentials = async (request: BatchUpdateCredentialsRequest) : Promise<BatchUpdateCredentialsResult>  => {
    return this.ds.batchUpdateCredentials({
      accountIds: request.account_ids,
      field: request.field,
      value: request.value,
    })
  }

  bulkUpdate = async (
    accountIdsOrPayload: number[] | Record<string, unknown>,
    updates?: Record<string, unknown>,
  ): Promise<BulkUpdateResult> => {
    return this.ds.bulkUpdate(accountIdsOrPayload, updates)
  }

  getBatchTodayStats = async (accountIds: number[]) : Promise<BatchTodayStatsResponse>  => {
    return (await this.ds.getBatchTodayStats(accountIds)).toEntity()
  }

  setSchedulable = async (id: number, schedulable: boolean) : Promise<Account>  => {
    return (await this.ds.setSchedulable(id, schedulable)).toEntity()
  }

  syncUpstreamModels = async (id: number) : Promise<SyncUpstreamModelsResult>  => {
    return this.ds.syncUpstreamModels(id)
  }

  syncUpstreamModelsPreview = async (params: SyncUpstreamPreviewParams) : Promise<SyncUpstreamModelsResult>  => {
    return this.ds.syncUpstreamModelsPreview({
      platform: params.platform,
      type: params.type,
      baseUrl: params.base_url,
      apiKey: params.api_key,
    })
  }

  previewFromCrs = async (params: { base_url: string; username: string; password: string }) : Promise<PreviewFromCRSResult>  => {
    return this.ds.previewFromCrs({
      baseUrl: params.base_url,
      username: params.username,
      password: params.password,
    })
  }

  syncFromCrs = async (params: {
    base_url: string
    username: string
    password: string
    sync_proxies?: boolean
    selected_account_ids?: string[]
  }): Promise<SyncFromCRSResult> => {
    return this.ds.syncFromCrs({
      baseUrl: params.base_url,
      username: params.username,
      password: params.password,
      syncProxies: params.sync_proxies,
      selectedAccountIds: params.selected_account_ids,
    })
  }

  importData = async (payload: { data: AdminDataPayload; skip_default_group_bind?: boolean }) : Promise<AdminDataImportResult>  => {
    return (await this.ds.importData({
      data: payload.data,
      skipDefaultGroupBind: payload.skip_default_group_bind,
    })).toEntity()
  }

  importCodexSession = async (payload: CodexSessionImportRequest) : Promise<CodexSessionImportResult>  => {
    return (await this.ds.importCodexSession(payload)).toEntity()
  }

  createOpenAICodexPAT = async (payload: OpenAICodexPATCreateRequest) : Promise<Account>  => {
    return (await this.ds.createOpenAICodexPAT(payload)).toEntity()
  }

  refreshOpenAIToken = async (
    refreshToken: string,
    proxyId?: number | null,
    endpoint: string = '/admin/openai/refresh-token',
    clientId?: string,
  ): Promise<Record<string, unknown>> => {
    return this.ds.refreshOpenAIToken(refreshToken, proxyId, endpoint, clientId)
  }

  revertProxyFallback = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.revertProxyFallback(id)
  }

  batchClearError = async (accountIds: number[]) : Promise<BatchOperationResult>  => {
    return this.ds.batchClearError(accountIds)
  }

  batchRefresh = async (accountIds: number[]) : Promise<BatchOperationResult>  => {
    return this.ds.batchRefresh(accountIds)
  }

  setPrivacy = async (id: number) : Promise<Account>  => {
    return (await this.ds.setPrivacy(id)).toEntity()
  }

  resetOpenAIQuota = async (id: number) : Promise<OpenAIQuotaResetResult>  => {
    return (await this.ds.resetOpenAIQuota(id)).toEntity()
  }

  createSparkShadow = async (
    parentId: number,
    payload: { name?: string; priority?: number; concurrency?: number; group_ids?: number[] },
  ): Promise<Account> => {
    return (await this.ds.createSparkShadow(parentId, {
      name: payload.name,
      priority: payload.priority,
      concurrency: payload.concurrency,
      groupIds: payload.group_ids,
    })).toEntity()
  }

  updateUpstreamBillingProbeSettings = async (settings: UpstreamBillingProbeSettings) : Promise<UpstreamBillingProbeSettings>  => {
    return (await this.ds.updateUpstreamBillingProbeSettings(settings)).toEntity()
  }

  setUpstreamBillingProbeEnabled = async (id: number, enabled: boolean) : Promise<void>  => {
    await this.ds.setUpstreamBillingProbeEnabled(id, enabled)
  }

  probeUpstreamBilling = async (id: number) : Promise<UpstreamBillingProbeResult>  => {
    return (await this.ds.probeUpstreamBilling(id)).toEntity()
  }

  probeUpstreamBillingBatch = async (accountIds: number[]) : Promise<UpstreamBillingProbeResult[]>  => {
    const dtos = await this.ds.probeUpstreamBillingBatch(accountIds)
    return dtos.map(dto => dto.toEntity())
  }
}

export const adminAccountsActionRepository: AdminAccountsActionRepository = new AdminAccountsActionRepositoryImpl()
