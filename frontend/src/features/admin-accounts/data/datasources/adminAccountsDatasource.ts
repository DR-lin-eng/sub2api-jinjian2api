/**
 * Admin Accounts API endpoints
 * Handles AI platform account management for administrators
 */

import { apiClient } from '@/core/networks/client'
import {
  getBatchSummaries,
  getBatchTodayStats,
  getAvailableModels,
  getById,
  getOllamaCloudUsage,
  getOllamaCloudUsageSettings,
  getStats,
  getTempUnschedulableStatus,
  getTodayStats,
  getUpstreamBillingProbeSettings,
  getUpstreamBillingRatesWithEtag,
  getUsage,
  list,
  listWithEtag
} from './adminAccountQueries'
import {
  batchClearError,
  batchDelete,
  batchRefresh,
  bulkUpdate,
  checkMixedChannelRisk,
  createSparkShadow,
  deleteOllamaCloudUsageSession,
  deleteAccount,
  duplicate,
  exportData,
  probeUpstreamBilling,
  probeUpstreamBillingBatch,
  queryUpstreamQuota,
  recoverState,
  refreshOllamaCloudUsage,
  refreshCredentials,
  resetAccountQuota,
  revertProxyFallback,
  saveOllamaCloudUsageSession,
  setPrivacy,
  setSchedulable,
  setOllamaCloudUsageAutoRefresh,
  syncCPACapacity,
  updateOllamaCloudUsageSettings
} from './adminAccountActions'
import type { CPACapacityStatus } from './adminAccountActions'
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AdminDataPayload,
  AdminDataImportResult,
  CodexSessionImportRequest,
  CodexSessionImportResult,
  OpenAICodexPATCreateRequest,
  UpstreamBillingProbeSettings
} from '@/types'

export {
  getBatchSummaries,
  getBatchTodayStats,
  getAvailableModels,
  getById,
  getOllamaCloudUsage,
  getOllamaCloudUsageSettings,
  getStats,
  getTempUnschedulableStatus,
  getTodayStats,
  getUpstreamBillingProbeSettings,
  getUpstreamBillingRatesWithEtag,
  getUsage,
  list,
  listWithEtag
} from './adminAccountQueries'
export type {
  AccountListFilters,
  AccountListOptions,
  AccountListWithEtagOptions,
  AccountListWithEtagResult,
  AccountSummary,
  AccountUpstreamBillingRateFilters,
  AccountUpstreamBillingRatesWithEtagResult,
  BatchTodayStatsResponse
} from './adminAccountQueries'
export {
  batchClearError,
  batchDelete,
  batchRefresh,
  bulkUpdate,
  checkMixedChannelRisk,
  createSparkShadow,
  deleteOllamaCloudUsageSession,
  deleteAccount,
  duplicate,
  exportData,
  probeUpstreamBilling,
  probeUpstreamBillingBatch,
  queryUpstreamQuota,
  recoverState,
  refreshOllamaCloudUsage,
  refreshCredentials,
  resetAccountQuota,
  revertProxyFallback,
  saveOllamaCloudUsageSession,
  setOllamaCloudUsageAutoRefresh,
  setPrivacy,
  setSchedulable,
  syncCPACapacity,
  updateOllamaCloudUsageSettings
} from './adminAccountActions'
export type {
  AccountExportOptions,
  BatchOperationResult,
  BulkUpdateResult,
  CPACapacityStatus,
  SparkShadowCreatePayload
} from './adminAccountActions'

/**
 * Create new account
 * @param accountData - Account data
 * @returns Created account
 */
export async function create(accountData: CreateAccountRequest): Promise<Account> {
  const { data } = await apiClient.post<Account>('/admin/accounts', accountData)
  return data
}

/**
 * Update account
 * @param id - Account ID
 * @param updates - Fields to update
 * @returns Updated account
 */
export async function update(id: number, updates: UpdateAccountRequest): Promise<Account> {
  const { data } = await apiClient.put<Account>(`/admin/accounts/${id}`, updates)
  return data
}

/**
 * Toggle account status
 * @param id - Account ID
 * @param status - New status
 * @returns Updated account
 */
export async function toggleStatus(id: number, status: 'active' | 'inactive'): Promise<Account> {
  return update(id, { status })
}

/**
 * Test account connectivity
 * @param id - Account ID
 * @returns Test result
 */
export async function testAccount(id: number): Promise<{
  success: boolean
  message: string
  latency_ms?: number
}> {
  const { data } = await apiClient.post<{
    success: boolean
    message: string
    latency_ms?: number
  }>(`/admin/accounts/${id}/test`)
  return data
}

export interface CPATestRequest {
  use_account_base_url?: boolean
  base_url?: string
  management_url?: string
  management_password?: string
  concurrency_per_credential?: number
}

export interface CPATestResult extends CPACapacityStatus {
  latency_ms: number
}

export async function testCPAConnection(id: number, payload: CPATestRequest): Promise<CPATestResult> {
  const { data } = await apiClient.post<CPATestResult>(`/admin/accounts/${id}/cpa/test`, payload)
  return data
}

/**
 * Apply OAuth credentials after re-authorization.
 *
 * Unlike `update()`, this endpoint:
 * - never overwrites the whole `extra` JSONB (merges incrementally instead),
 *   so persistent settings like `base_rpm`, `window_cost_limit`, `max_sessions`,
 *   `quota_*` and `privacy_mode` are preserved
 * - clears the account error and invalidates the token cache server-side
 */
export async function applyOAuthCredentials(
  id: number,
  payload: {
    type: 'oauth' | 'setup-token'
    credentials: Record<string, unknown>
    extra?: Record<string, unknown>
  }
): Promise<Account> {
  const { data } = await apiClient.post<Account>(
    `/admin/accounts/${id}/apply-oauth-credentials`,
    payload
  )
  return data
}

/**
 * Clear account error
 * @param id - Account ID
 * @returns Updated account
 */
export async function clearError(id: number): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/clear-error`)
  return data
}

/**
 * Clear account rate limit status
 * @param id - Account ID
 * @returns Updated account
 */
export async function clearRateLimit(id: number): Promise<Account> {
  const { data } = await apiClient.post<Account>(
    `/admin/accounts/${id}/clear-rate-limit`
  )
  return data
}

/**
 * Reset temporary unschedulable status
 * @param id - Account ID
 * @returns Success confirmation
 */
export async function resetTempUnschedulable(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(
    `/admin/accounts/${id}/temp-unschedulable`
  )
  return data
}

/**
 * Generate OAuth authorization URL
 * @param endpoint - API endpoint path
 * @param config - Proxy configuration
 * @returns Auth URL and session ID
 */
export async function generateAuthUrl(
  endpoint: string,
  config: { proxy_id?: number }
): Promise<{ auth_url: string; session_id: string }> {
  const { data } = await apiClient.post<{ auth_url: string; session_id: string }>(endpoint, config)
  return data
}

/**
 * Exchange authorization code for tokens
 * @param endpoint - API endpoint path
 * @param exchangeData - Session ID, code, and optional proxy config
 * @returns Token information
 */
export async function exchangeCode(
  endpoint: string,
  exchangeData: { session_id: string; code: string; state?: string; proxy_id?: number }
): Promise<Record<string, unknown>> {
  const { data } = await apiClient.post<Record<string, unknown>>(endpoint, exchangeData)
  return data
}

/**
 * Batch create accounts
 * @param accounts - Array of account data
 * @returns Results of batch creation
 */
export async function batchCreate(accounts: CreateAccountRequest[]): Promise<{
  success: number
  failed: number
  results: Array<{ success: boolean; account?: Account; error?: string }>
}> {
  const { data } = await apiClient.post<{
    success: number
    failed: number
    results: Array<{ success: boolean; account?: Account; error?: string }>
  }>('/admin/accounts/batch', { accounts })
  return data
}

/**
 * Batch update credentials fields for multiple accounts
 * @param request - Batch update request containing account IDs, field name, and value
 * @returns Results of batch update
 */
export async function batchUpdateCredentials(request: {
  account_ids: number[]
  field: string
  value: any
}): Promise<{
  success: number
  failed: number
  results: Array<{ account_id: number; success: boolean; error?: string }>
}> {
  const { data } = await apiClient.post<{
    success: number
    failed: number
    results: Array<{ account_id: number; success: boolean; error?: string }>
  }>('/admin/accounts/batch-update-credentials', request)
  return data
}

/**
 * Bulk update multiple accounts
 * @param accountIds - Array of account IDs
 * @param updates - Fields to update
 * @returns Success confirmation
 */
/**
 * Set account schedulable status
 * @param id - Account ID
 * @param schedulable - Whether the account should participate in scheduling
 * @returns Updated account
 */
/**
 * Get available models for an account
 * @param id - Account ID
 * @returns List of available models for this account
 */
export interface SyncUpstreamModelsResult {
  models: string[]
}

/**
 * Sync live supported models from the account's upstream model-list endpoint
 * @param id - Account ID
 * @returns List of model IDs returned by the upstream
 */
export async function syncUpstreamModels(id: number): Promise<SyncUpstreamModelsResult> {
  const { data } = await apiClient.post<SyncUpstreamModelsResult>(`/admin/accounts/${id}/models/sync-upstream`)
  return data
}

export interface SyncUpstreamPreviewParams {
  platform: string
  type: string
  base_url?: string
  api_key: string
}

/**
 * Preview upstream models without a saved account (create-flow)
 * @param params - Connection credentials
 * @returns List of model IDs returned by the upstream
 */
export async function syncUpstreamModelsPreview(params: SyncUpstreamPreviewParams): Promise<SyncUpstreamModelsResult> {
  const { data } = await apiClient.post<SyncUpstreamModelsResult>('/admin/accounts/models/sync-upstream-preview', params)
  return data
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

export async function previewFromCrs(params: {
  base_url: string
  username: string
  password: string
}): Promise<PreviewFromCRSResult> {
  const { data } = await apiClient.post<PreviewFromCRSResult>('/admin/accounts/sync/crs/preview', params)
  return data
}

export async function syncFromCrs(params: {
  base_url: string
  username: string
  password: string
  sync_proxies?: boolean
  selected_account_ids?: string[]
}): Promise<{
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
}> {
  const { data } = await apiClient.post<{
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
  }>('/admin/accounts/sync/crs', params, {
    timeout: 180000 // 180s timeout: sync refreshes each existing account's OAuth token serially
  })
  return data
}

export async function importData(payload: {
  data: AdminDataPayload
  skip_default_group_bind?: boolean
}): Promise<AdminDataImportResult> {
  const { data } = await apiClient.post<AdminDataImportResult>('/admin/accounts/data', {
    data: payload.data,
    skip_default_group_bind: payload.skip_default_group_bind
  })
  return data
}

export async function importCodexSession(payload: CodexSessionImportRequest): Promise<CodexSessionImportResult> {
  const { data } = await apiClient.post<CodexSessionImportResult>('/admin/accounts/import/codex-session', payload, {
    timeout: 120000 // 120s timeout for large session imports
  })
  return data
}

export async function createOpenAICodexPAT(payload: OpenAICodexPATCreateRequest): Promise<Account> {
  const { data } = await apiClient.post<Account>('/admin/openai/create-from-codex-pat', payload)
  return data
}

/**
 * Get Antigravity default model mapping from backend
 * @returns Default model mapping (from -> to)
 */
export async function getAntigravityDefaultModelMapping(): Promise<Record<string, string>> {
  const { data } = await apiClient.get<Record<string, string>>(
    '/admin/accounts/antigravity/default-model-mapping'
  )
  return data
}

/**
 * Refresh OpenAI token using refresh token
 * @param refreshToken - The refresh token
 * @param proxyId - Optional proxy ID
 * @returns Token information including access_token, email, etc.
 */
export async function refreshOpenAIToken(
  refreshToken: string,
  proxyId?: number | null,
  endpoint: string = '/admin/openai/refresh-token',
  clientId?: string
): Promise<Record<string, unknown>> {
  const payload: { refresh_token: string; proxy_id?: number; client_id?: string } = {
    refresh_token: refreshToken
  }
  if (proxyId) {
    payload.proxy_id = proxyId
  }
  if (clientId) {
    payload.client_id = clientId
  }
  const { data } = await apiClient.post<Record<string, unknown>>(endpoint, payload)
  return data
}

/**
 * Batch operation result type
 */
/**
 * OpenAI / Codex rate-limit reset feature: query and reset upstream usage.
 */
export interface OpenAIRateLimitWindow {
  used_percent: number
  limit_window_seconds: number
  reset_after_seconds: number
  reset_at: number
}

export interface OpenAIRateLimit {
  allowed: boolean
  limit_reached: boolean
  primary_window?: OpenAIRateLimitWindow | null
  secondary_window?: OpenAIRateLimitWindow | null
}

export interface OpenAIAdditionalRateLimit {
  limit_name: string
  metered_feature: string
  rate_limit?: OpenAIRateLimit | null
}

export interface OpenAIRateLimitResetCreditDetail {
  expires_at?: string
}

export interface OpenAIRateLimitResetCredits {
  available_count: number
  credits?: OpenAIRateLimitResetCreditDetail[]
}

export interface OpenAIQuotaUsage {
  user_id?: string
  account_id?: string
  email?: string
  plan_type?: string
  rate_limit?: OpenAIRateLimit | null
  additional_rate_limits?: OpenAIAdditionalRateLimit[]
  rate_limit_reset_credits?: OpenAIRateLimitResetCredits | null
  fetched_at: number
}

export interface OpenAIQuotaResetCredit {
  id?: string
  reset_type?: string
  status?: string
  granted_at?: string
  expires_at?: string
  redeem_started_at?: string
  redeemed_at?: string
}

export interface OpenAIQuotaResetResult {
  code: string
  credit?: OpenAIQuotaResetCredit | null
  windows_reset: number
  quota?: OpenAIQuotaUsage | null
  account?: Account | null
  cache_refreshed: boolean
  account_state_recovered: boolean
  warning_code?:
    | 'reset_credit_cache_refresh_failed'
    | 'account_state_recovery_failed'
    | 'account_state_refresh_failed'
}

export interface OpenAIQuotaRefreshResult extends OpenAIQuotaUsage {
  cache_persisted: boolean
}

/**
 * Query OpenAI/Codex rate-limit usage for an OAuth account.
 */
export async function queryOpenAIQuota(id: number): Promise<OpenAIQuotaUsage> {
  const { data } = await apiClient.get<OpenAIQuotaUsage>(`/admin/openai/accounts/${id}/quota`)
  return data
}

/** Query upstream quota and persist its reset-credit expiration snapshot. */
export async function refreshOpenAIQuota(id: number): Promise<OpenAIQuotaRefreshResult> {
  const { data } = await apiClient.post<OpenAIQuotaRefreshResult>(
    `/admin/openai/accounts/${id}/quota/refresh`
  )
  return data
}

/**
 * Consume one rate-limit-reset credit for an OpenAI/Codex OAuth account.
 */
export async function resetOpenAIQuota(id: number): Promise<OpenAIQuotaResetResult> {
  const { data } = await apiClient.post<OpenAIQuotaResetResult>(
    `/admin/openai/accounts/${id}/reset-quota`,
    undefined,
    { timeout: 90_000 }
  )
  return data
}

export async function updateUpstreamBillingProbeSettings(
  settings: UpstreamBillingProbeSettings
): Promise<UpstreamBillingProbeSettings> {
  const { data } = await apiClient.put<UpstreamBillingProbeSettings>(
    '/admin/accounts/upstream-billing-probe/settings',
    settings
  )
  return data
}

export async function setUpstreamBillingProbeEnabled(id: number, enabled: boolean): Promise<void> {
  await apiClient.put(`/admin/accounts/${id}/upstream-billing-probe`, { enabled })
}

export const accountsAPI = {
  list,
  listWithEtag,
  getUpstreamBillingRatesWithEtag,
  getById,
  getBatchSummaries,
  create,
  duplicate,
  update,
  checkMixedChannelRisk,
  delete: deleteAccount,
  toggleStatus,
  testAccount,
  testCPAConnection,
  syncCPACapacity,
  refreshCredentials,
  applyOAuthCredentials,
  getStats,
  clearError,
  getUsage,
  getTodayStats,
  getBatchTodayStats,
  clearRateLimit,
  recoverState,
  resetAccountQuota,
  getTempUnschedulableStatus,
  resetTempUnschedulable,
  setSchedulable,
  getAvailableModels,
  syncUpstreamModels,
  syncUpstreamModelsPreview,
  generateAuthUrl,
  exchangeCode,
  refreshOpenAIToken,
  batchCreate,
  batchUpdateCredentials,
  bulkUpdate,
  previewFromCrs,
  syncFromCrs,
  exportData,
  importData,
  importCodexSession,
  createOpenAICodexPAT,
  getAntigravityDefaultModelMapping,
  batchDelete,
  batchClearError,
  batchRefresh,
  setPrivacy,
  revertProxyFallback,
  queryOpenAIQuota,
  refreshOpenAIQuota,
  resetOpenAIQuota,
  createSparkShadow,
  getUpstreamBillingProbeSettings,
  updateUpstreamBillingProbeSettings,
  setUpstreamBillingProbeEnabled,
  probeUpstreamBilling,
  probeUpstreamBillingBatch,
  queryUpstreamQuota,
  getOllamaCloudUsageSettings,
  updateOllamaCloudUsageSettings,
  getOllamaCloudUsage,
  saveOllamaCloudUsageSession,
  deleteOllamaCloudUsageSession,
  setOllamaCloudUsageAutoRefresh,
  refreshOllamaCloudUsage
}

export default accountsAPI
