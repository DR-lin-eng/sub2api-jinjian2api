/**
 * Admin Accounts Action Datasource (POST/PUT/DELETE, per §5.1 R1)
 * Returns DTO instances (via Dto.fromJson) — never Entity.
 */

import { apiClient } from '@/core/networks/client'
import { AccountDto } from '@/core/models/data/accountDto'
import { UpstreamBillingProbeSettingsDto } from '@/features/admin-accounts/data/models/upstreamBillingProbeSettingsDto'
import { UpstreamBillingProbeResultDto } from '@/features/admin-accounts/data/models/upstreamBillingProbeResultDto'
import { AdminDataImportResultDto } from '@/features/admin-accounts/data/models/adminDataImportResultDto'
import { CodexSessionImportResultDto } from '@/features/admin-accounts/data/models/codexSessionImportResultDto'
import { BatchTodayStatsResponseDto } from '@/features/admin-accounts/data/models/batchTodayStatsResponseDto'
import { OpenAIQuotaResetResultDto } from '@/features/admin-accounts/data/models/openAIQuotaResetResultDto'
import type { CodexSessionImportRequest } from '@/features/admin-accounts/data/requests_models/codexSessionImportRequest'
import type { OpenAICodexPATCreateRequest } from '@/features/admin-accounts/data/requests_models/openAICodexPATCreateRequest'
import type { CreateAccountRequest } from '@/features/admin-accounts/data/requests_models/createAccountRequest'
import type { UpdateAccountRequest } from '@/features/admin-accounts/data/requests_models/updateAccountRequest'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { CheckMixedChannelRequest } from '@/features/admin-accounts/data/requests_models/checkMixedChannelRequest'
import { CheckMixedChannelResponseDto } from '@/features/admin-accounts/data/models/checkMixedChannelResponseDto'
import type { UpstreamBillingProbeSettings } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSettings'

// Local response-Dto shapes used only for this datasource file
export interface AccountSummaryDto {
  id: number
  name: string
}
export interface SyncUpstreamModelsResultDto {
  models: string[]
}
export interface CRSPreviewAccountDto {
  crs_account_id: string
  kind: string
  name: string
  platform: string
  type: string
}
export interface PreviewFromCRSResultDto {
  new_accounts: CRSPreviewAccountDto[]
  existing_accounts: CRSPreviewAccountDto[]
}
export interface SyncFromCRSResultDto {
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
export interface BatchOperationResultDto {
  total: number
  success: number
  failed: number
  errors?: Array<{ account_id: number; error: string }>
  warnings?: Array<{ account_id: number; warning: string }>
}
export interface BatchCreateResultDto {
  success: number
  failed: number
  results: Array<{ success: boolean; account?: AccountDto; error?: string }>
}
export interface BatchUpdateCredentialsResultDto {
  success: number
  failed: number
  results: Array<{ account_id: number; success: boolean; error?: string }>
}
export interface BulkUpdateResultDto {
  success: number
  failed: number
  success_ids?: number[]
  failed_ids?: number[]
  results: Array<{ account_id: number; success: boolean; error?: string }>
}
export interface TestAccountResultDto {
  success: boolean
  message: string
  latency_ms?: number
}
export interface OAuthAuthUrlResponseDto {
  auth_url: string
  session_id: string
}

// ==================== File-private helpers (Duplicate idempotency) ====================

const duplicateOperationKeys = new Map<number, string>()

function duplicateOperationStorageKey(id: number): string {
  return `sub2api:admin:account-duplicate:${id}`
}

function getStoredDuplicateOperationKey(id: number): string | null {
  try {
    return globalThis.sessionStorage?.getItem(duplicateOperationStorageKey(id)) ?? null
  } catch {
    return null
  }
}

function storeDuplicateOperationKey(id: number, key: string | null): void {
  try {
    if (key) globalThis.sessionStorage?.setItem(duplicateOperationStorageKey(id), key)
    else globalThis.sessionStorage?.removeItem(duplicateOperationStorageKey(id))
  } catch {
    // In-memory retry protection still works when browser storage is unavailable.
  }
}

// ==================== Action Datasource ====================

export class AdminAccountsActionDatasource {
  async getBatchSummaries(accountIds: number[]): Promise<AccountSummaryDto[]> {
    const { data } = await apiClient.post<{ items: AccountSummaryDto[] }>(
      '/admin/accounts/summaries/batch',
      { account_ids: accountIds },
    )
    return data.items
  }

  async create(req: CreateAccountRequest): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>('/admin/accounts', req)
    return AccountDto.fromJson(data)
  }

  async duplicate(id: number): Promise<AccountDto> {
    let idempotencyKey = duplicateOperationKeys.get(id) ?? getStoredDuplicateOperationKey(id)
    if (!idempotencyKey) {
      const requestID = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      idempotencyKey = `account-duplicate-${id}-${requestID}`
    }
    duplicateOperationKeys.set(id, idempotencyKey)
    storeDuplicateOperationKey(id, idempotencyKey)
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/duplicate`, undefined, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    duplicateOperationKeys.delete(id)
    storeDuplicateOperationKey(id, null)
    return AccountDto.fromJson(data)
  }

  async update(id: number, req: UpdateAccountRequest): Promise<AccountDto> {
    const { data } = await apiClient.put<unknown>(`/admin/accounts/${id}`, req)
    return AccountDto.fromJson(data)
  }

  async checkMixedChannelRisk(entity: CheckMixedChannelRequest): Promise<CheckMixedChannelResponseDto> {
    const payload: Record<string, unknown> = {
      platform: entity.platform,
      group_ids: entity.group_ids,
    }
    if (entity.account_id !== undefined) payload.account_id = entity.account_id
    const { data } = await apiClient.post<unknown>('/admin/accounts/check-mixed-channel', payload)
    return CheckMixedChannelResponseDto.fromJson(data)
  }

  async deleteAccount(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/accounts/${id}`)
    return data
  }

  async testAccount(id: number): Promise<TestAccountResultDto> {
    const { data } = await apiClient.post<TestAccountResultDto>(`/admin/accounts/${id}/test`)
    return data
  }

  async refreshCredentials(id: number): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/refresh`)
    return AccountDto.fromJson(data)
  }

  async applyOAuthCredentials(
    id: number,
    entity: { type: 'oauth' | 'setup-token'; credentials: Record<string, unknown>; extra?: Record<string, unknown> },
  ): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/accounts/${id}/apply-oauth-credentials`,
      entity,
    )
    return AccountDto.fromJson(data)
  }

  async clearError(id: number): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/clear-error`)
    return AccountDto.fromJson(data)
  }

  async clearRateLimit(id: number): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/clear-rate-limit`)
    return AccountDto.fromJson(data)
  }

  async recoverState(id: number): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/recover-state`)
    return AccountDto.fromJson(data)
  }

  async resetAccountQuota(id: number): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/reset-quota`)
    return AccountDto.fromJson(data)
  }

  async resetTempUnschedulable(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/admin/accounts/${id}/temp-unschedulable`,
    )
    return data
  }

  async generateAuthUrl(endpoint: string, config: { proxyId?: number }): Promise<OAuthAuthUrlResponseDto> {
    const payload: Record<string, unknown> = {}
    if (config.proxyId !== undefined) payload.proxy_id = config.proxyId
    const { data } = await apiClient.post<OAuthAuthUrlResponseDto>(endpoint, payload)
    return data
  }

  async exchangeCode(
    endpoint: string,
    exchangeData: { sessionId: string; code: string; state?: string; proxyId?: number },
  ): Promise<Record<string, unknown>> {
    const payload: Record<string, unknown> = {
      session_id: exchangeData.sessionId,
      code: exchangeData.code,
    }
    if (exchangeData.state !== undefined) payload.state = exchangeData.state
    if (exchangeData.proxyId !== undefined) payload.proxy_id = exchangeData.proxyId
    const { data } = await apiClient.post<Record<string, unknown>>(endpoint, payload)
    return data
  }

  async batchCreate(accounts: CreateAccountRequest[]): Promise<BatchCreateResultDto> {
    const { data } = await apiClient.post<{ success: number; failed: number; results: Array<{ success: boolean; account?: unknown; error?: string }> }>(
      '/admin/accounts/batch',
      { accounts: accounts },
    )
    return {
      success: data.success,
      failed: data.failed,
      results: data.results.map(r => ({
        success: r.success,
        account: r.account ? AccountDto.fromJson(r.account) : undefined,
        error: r.error,
      })),
    }
  }

  async batchUpdateCredentials(
    request: { accountIds: number[]; field: string; value: unknown },
  ): Promise<BatchUpdateCredentialsResultDto> {
    const { data } = await apiClient.post<BatchUpdateCredentialsResultDto>(
      '/admin/accounts/batch-update-credentials',
      {
        account_ids: request.accountIds,
        field: request.field,
        value: request.value,
      },
    )
    return data
  }

  async bulkUpdate(
    accountIdsOrPayload: number[] | Record<string, unknown>,
    updates?: Record<string, unknown>,
  ): Promise<BulkUpdateResultDto> {
    const payload = Array.isArray(accountIdsOrPayload)
      ? { account_ids: accountIdsOrPayload, ...(updates ?? {}) }
      : accountIdsOrPayload
    const { data } = await apiClient.post<BulkUpdateResultDto>('/admin/accounts/bulk-update', payload)
    return data
  }

  async getBatchTodayStats(accountIds: number[]): Promise<BatchTodayStatsResponseDto> {
    const { data } = await apiClient.post<unknown>('/admin/accounts/today-stats/batch', {
      account_ids: accountIds,
    })
    return BatchTodayStatsResponseDto.fromJson(data)
  }

  async setSchedulable(id: number, schedulable: boolean): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/schedulable`, { schedulable })
    return AccountDto.fromJson(data)
  }

  async syncUpstreamModels(id: number): Promise<SyncUpstreamModelsResultDto> {
    const { data } = await apiClient.post<SyncUpstreamModelsResultDto>(`/admin/accounts/${id}/models/sync-upstream`)
    return data
  }

  async syncUpstreamModelsPreview(
    entity: { platform: string; type: string; baseUrl?: string; apiKey: string },
  ): Promise<SyncUpstreamModelsResultDto> {
    const payload: Record<string, unknown> = {
      platform: entity.platform,
      type: entity.type,
      api_key: entity.apiKey,
    }
    if (entity.baseUrl !== undefined) payload.base_url = entity.baseUrl
    const { data } = await apiClient.post<SyncUpstreamModelsResultDto>(
      '/admin/accounts/models/sync-upstream-preview',
      payload,
    )
    return data
  }

  async previewFromCrs(
    entity: { baseUrl: string; username: string; password: string },
  ): Promise<PreviewFromCRSResultDto> {
    const { data } = await apiClient.post<PreviewFromCRSResultDto>('/admin/accounts/sync/crs/preview', {
      base_url: entity.baseUrl,
      username: entity.username,
      password: entity.password,
    })
    return data
  }

  async syncFromCrs(
    entity: {
      baseUrl: string
      username: string
      password: string
      syncProxies?: boolean
      selectedAccountIds?: string[]
    },
  ): Promise<SyncFromCRSResultDto> {
    const payload: Record<string, unknown> = {
      base_url: entity.baseUrl,
      username: entity.username,
      password: entity.password,
    }
    if (entity.syncProxies !== undefined) payload.sync_proxies = entity.syncProxies
    if (entity.selectedAccountIds !== undefined) payload.selected_account_ids = entity.selectedAccountIds
    const { data } = await apiClient.post<SyncFromCRSResultDto>('/admin/accounts/sync/crs', payload, {
      timeout: 180000,
    })
    return data
  }

  async importData(entity: { data: AdminDataPayload; skipDefaultGroupBind?: boolean }): Promise<AdminDataImportResultDto> {
    const payload: Record<string, unknown> = { data: entity.data }
    if (entity.skipDefaultGroupBind !== undefined) payload.skip_default_group_bind = entity.skipDefaultGroupBind
    const { data } = await apiClient.post<unknown>('/admin/accounts/data', payload)
    return AdminDataImportResultDto.fromJson(data)
  }

  async importCodexSession(entity: CodexSessionImportRequest): Promise<CodexSessionImportResultDto> {
    const { data } = await apiClient.post<unknown>('/admin/accounts/import/codex-session', entity, {
      timeout: 120000,
    })
    return CodexSessionImportResultDto.fromJson(data)
  }

  async createOpenAICodexPAT(entity: OpenAICodexPATCreateRequest): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>('/admin/openai/create-from-codex-pat', entity)
    return AccountDto.fromJson(data)
  }

  async refreshOpenAIToken(
    refreshToken: string,
    proxyId?: number | null,
    endpoint: string = '/admin/openai/refresh-token',
    clientId?: string,
  ): Promise<Record<string, unknown>> {
    const payload: Record<string, unknown> = { refresh_token: refreshToken }
    if (proxyId) payload.proxy_id = proxyId
    if (clientId) payload.client_id = clientId
    const { data } = await apiClient.post<Record<string, unknown>>(endpoint, payload)
    return data
  }

  async revertProxyFallback(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(`/admin/accounts/${id}/revert-proxy-fallback`)
    return data
  }

  async batchClearError(accountIds: number[]): Promise<BatchOperationResultDto> {
    const { data } = await apiClient.post<BatchOperationResultDto>('/admin/accounts/batch-clear-error', {
      account_ids: accountIds,
    })
    return data
  }

  async batchRefresh(accountIds: number[]): Promise<BatchOperationResultDto> {
    const { data } = await apiClient.post<BatchOperationResultDto>('/admin/accounts/batch-refresh',
      { account_ids: accountIds },
      { timeout: 120000 },
    )
    return data
  }

  async setPrivacy(id: number): Promise<AccountDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/set-privacy`)
    return AccountDto.fromJson(data)
  }

  async resetOpenAIQuota(id: number): Promise<OpenAIQuotaResetResultDto> {
    const { data } = await apiClient.post<unknown>(`/admin/openai/accounts/${id}/reset-quota`)
    return OpenAIQuotaResetResultDto.fromJson(data)
  }

  async createSparkShadow(
    parentId: number,
    entity: { name?: string; priority?: number; concurrency?: number; groupIds?: number[] },
  ): Promise<AccountDto> {
    const payload: Record<string, unknown> = {}
    if (entity.name !== undefined) payload.name = entity.name
    if (entity.priority !== undefined) payload.priority = entity.priority
    if (entity.concurrency !== undefined) payload.concurrency = entity.concurrency
    if (entity.groupIds !== undefined) payload.group_ids = entity.groupIds
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${parentId}/shadow`, payload)
    return AccountDto.fromJson(data)
  }

  async updateUpstreamBillingProbeSettings(entity: UpstreamBillingProbeSettings): Promise<UpstreamBillingProbeSettingsDto> {
    const { data } = await apiClient.put<unknown>(
      '/admin/accounts/upstream-billing-probe/settings',
      { enabled: entity.enabled, interval_minutes: entity.intervalMinutes },
    )
    return UpstreamBillingProbeSettingsDto.fromJson(data)
  }

  async setUpstreamBillingProbeEnabled(id: number, enabled: boolean): Promise<void> {
    await apiClient.put(`/admin/accounts/${id}/upstream-billing-probe`, { enabled })
  }

  async probeUpstreamBilling(id: number): Promise<UpstreamBillingProbeResultDto> {
    const { data } = await apiClient.post<unknown>(`/admin/accounts/${id}/upstream-billing-probe`)
    return UpstreamBillingProbeResultDto.fromJson(data)
  }

  async probeUpstreamBillingBatch(accountIds: number[]): Promise<UpstreamBillingProbeResultDto[]> {
    const { data } = await apiClient.post<{ results: unknown[] }>(
      '/admin/accounts/upstream-billing-probe/batch',
      { account_ids: accountIds },
    )
    return (data.results ?? []).map(item => UpstreamBillingProbeResultDto.fromJson(item))
  }
}

export const adminAccountsActionDatasource = new AdminAccountsActionDatasource()
