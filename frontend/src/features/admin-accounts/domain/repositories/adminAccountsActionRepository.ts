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

// Entity-side interfaces referenced by repository return types
export interface AccountSummary {
  id: number
  name: string
}

export interface SyncUpstreamModelsResult {
  models: string[]
}

export interface SyncUpstreamPreviewParams {
  platform: string
  type: string
  base_url?: string
  api_key: string
}

export interface CRSPreviewAccount {
  crs_account_id: string
  kind: string
  name: string
  platform: string
  type: string
}

export interface PreviewFromCRSResult {
  new_accounts: CRSPreviewAccount[]
  existing_accounts: CRSPreviewAccount[]
}

export interface SyncFromCRSResult {
  created: number
  updated: number
  skipped: number
  failed: number
  items: Array<{
    crs_account_id: string
    kind: string
    name: string
    action: string
    error?: string
  }>
}

export interface BatchOperationResult {
  total: number
  success: number
  failed: number
  errors?: Array<{ account_id: number; error: string }>
  warnings?: Array<{ account_id: number; warning: string }>
}

export interface BatchCreateResult {
  success: number
  failed: number
  results: Array<{ success: boolean; account?: Account; error?: string }>
}

export interface BatchUpdateCredentialsRequest {
  account_ids: number[]
  field: string
  value: unknown
}

export interface BatchUpdateCredentialsResult {
  success: number
  failed: number
  results: Array<{ account_id: number; success: boolean; error?: string }>
}

export interface BulkUpdateResult {
  success: number
  failed: number
  success_ids?: number[]
  failed_ids?: number[]
  results: Array<{ account_id: number; success: boolean; error?: string }>
}

export interface TestAccountResult {
  success: boolean
  message: string
  latency_ms?: number
}

export interface OAuthAuthUrlResponse {
  auth_url: string
  session_id: string
}

export interface ApplyOAuthCredentialsPayload {
  type: 'oauth' | 'setup-token'
  credentials: Record<string, unknown>
  extra?: Record<string, unknown>
}

export interface AdminAccountsActionRepository {
  getBatchSummaries(accountIds: number[]): Promise<AccountSummary[]>
  create(accountData: CreateAccountRequest): Promise<Account>
  duplicate(id: number): Promise<Account>
  update(id: number, updates: UpdateAccountRequest): Promise<Account>
  checkMixedChannelRisk(payload: CheckMixedChannelRequest): Promise<CheckMixedChannelResponse>
  deleteAccount(id: number): Promise<{ message: string }>
  toggleStatus(id: number, status: 'active' | 'inactive'): Promise<Account>
  testAccount(id: number): Promise<TestAccountResult>
  refreshCredentials(id: number): Promise<Account>
  applyOAuthCredentials(id: number, payload: ApplyOAuthCredentialsPayload): Promise<Account>
  clearError(id: number): Promise<Account>
  clearRateLimit(id: number): Promise<Account>
  recoverState(id: number): Promise<Account>
  resetAccountQuota(id: number): Promise<Account>
  resetTempUnschedulable(id: number): Promise<{ message: string }>
  generateAuthUrl(endpoint: string, config: { proxy_id?: number }): Promise<OAuthAuthUrlResponse>
  exchangeCode(endpoint: string, exchangeData: { session_id: string; code: string; state?: string; proxy_id?: number }): Promise<Record<string, unknown>>
  batchCreate(accounts: CreateAccountRequest[]): Promise<BatchCreateResult>
  batchUpdateCredentials(request: BatchUpdateCredentialsRequest): Promise<BatchUpdateCredentialsResult>
  bulkUpdate(
    accountIdsOrPayload: number[] | Record<string, unknown>,
    updates?: Record<string, unknown>,
  ): Promise<BulkUpdateResult>
  getBatchTodayStats(accountIds: number[]): Promise<BatchTodayStatsResponse>
  setSchedulable(id: number, schedulable: boolean): Promise<Account>
  syncUpstreamModels(id: number): Promise<SyncUpstreamModelsResult>
  syncUpstreamModelsPreview(params: SyncUpstreamPreviewParams): Promise<SyncUpstreamModelsResult>
  previewFromCrs(params: { base_url: string; username: string; password: string }): Promise<PreviewFromCRSResult>
  syncFromCrs(params: {
    base_url: string
    username: string
    password: string
    sync_proxies?: boolean
    selected_account_ids?: string[]
  }): Promise<SyncFromCRSResult>
  importData(payload: { data: AdminDataPayload; skip_default_group_bind?: boolean }): Promise<AdminDataImportResult>
  importCodexSession(payload: CodexSessionImportRequest): Promise<CodexSessionImportResult>
  createOpenAICodexPAT(payload: OpenAICodexPATCreateRequest): Promise<Account>
  refreshOpenAIToken(
    refreshToken: string,
    proxyId?: number | null,
    endpoint?: string,
    clientId?: string,
  ): Promise<Record<string, unknown>>
  revertProxyFallback(id: number): Promise<{ message: string }>
  batchClearError(accountIds: number[]): Promise<BatchOperationResult>
  batchRefresh(accountIds: number[]): Promise<BatchOperationResult>
  setPrivacy(id: number): Promise<Account>
  resetOpenAIQuota(id: number): Promise<OpenAIQuotaResetResult>
  createSparkShadow(
    parentId: number,
    payload: { name?: string; priority?: number; concurrency?: number; group_ids?: number[] },
  ): Promise<Account>
  updateUpstreamBillingProbeSettings(settings: UpstreamBillingProbeSettings): Promise<UpstreamBillingProbeSettings>
  setUpstreamBillingProbeEnabled(id: number, enabled: boolean): Promise<void>
  probeUpstreamBilling(id: number): Promise<UpstreamBillingProbeResult>
  probeUpstreamBillingBatch(accountIds: number[]): Promise<UpstreamBillingProbeResult[]>
}
