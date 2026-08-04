/**
 * Admin Accounts API endpoints
 * Handles AI platform account management for administrators
 */

import { apiClient } from '@/core/networks/client'
import {
  exchangeCode,
  generateAuthUrl,
  refreshOpenAIToken
} from './adminAccountOAuthActions'
import {
  getBatchSummaries,
  getBatchTodayStats,
  getAvailableModels,
  getAntigravityDefaultModelMapping,
  getById,
  getOllamaCloudUsage,
  getOllamaCloudUsageSettings,
  previewFromCrs,
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
  applyOAuthCredentials,
  batchClearError,
  batchDelete,
  batchRefresh,
  bulkUpdate,
  checkMixedChannelRisk,
  clearAccountError,
  createAccount,
  createOpenAICodexPAT,
  createSparkShadow,
  deleteOllamaCloudUsageSession,
  deleteAccount,
  duplicate,
  exportData,
  importCodexSession,
  importData,
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
  syncFromCrs,
  syncUpstreamModels,
  syncUpstreamModelsPreview,
  testCPAConnection,
  updateAccount,
  updateOllamaCloudUsageSettings
} from './adminAccountActions'
import type {
  Account,
  UpstreamBillingProbeSettings
} from '@/types'
import type { CreateAccountRequest } from '../dtos/adminAccountDtos'

export {
  getBatchSummaries,
  getBatchTodayStats,
  getAvailableModels,
  getAntigravityDefaultModelMapping,
  getById,
  getOllamaCloudUsage,
  getOllamaCloudUsageSettings,
  previewFromCrs,
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
  createAccount as create,
  createOpenAICodexPAT,
  createSparkShadow,
  deleteOllamaCloudUsageSession,
  deleteAccount,
  duplicate,
  exportData,
  importCodexSession,
  importData,
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
  syncFromCrs,
  syncUpstreamModels,
  syncUpstreamModelsPreview,
  testCPAConnection,
  updateOllamaCloudUsageSettings
} from './adminAccountActions'
export {
  applyOAuthCredentials,
  clearAccountError as clearError,
  updateAccount as update
} from './adminAccountActions'
export {
  exchangeCode,
  generateAuthUrl,
  refreshOpenAIToken
} from './adminAccountOAuthActions'
export type {
  AccountAuthUrlResponse,
  AccountOAuthExchangeRequest,
  AccountOAuthMethod,
  AccountOAuthTokenInfo,
  OpenAIAuthUrlRequest,
  OpenAIExchangeCodeRequest,
  OpenAITokenInfo
} from './adminAccountOAuthActions'
export type {
  AccountExportOptions,
  AccountDataImportPayload,
  BatchOperationResult,
  BulkUpdateResult,
  CPATestRequest,
  CPATestResult,
  CPACapacityStatus,
  CRSSyncItem,
  CRSSyncParams,
  CRSSyncResult,
  SparkShadowCreatePayload,
  SyncUpstreamModelsResult,
  SyncUpstreamPreviewParams
} from './adminAccountActions'
export type {
  CRSConnectionParams,
  CRSPreviewAccount,
  PreviewFromCRSResult
} from './adminAccountQueries'

/**
 * Toggle account status
 * @param id - Account ID
 * @param status - New status
 * @returns Updated account
 */
export async function toggleStatus(id: number, status: 'active' | 'inactive'): Promise<Account> {
  return updateAccount(id, { status })
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
  create: createAccount,
  duplicate,
  update: updateAccount,
  checkMixedChannelRisk,
  delete: deleteAccount,
  toggleStatus,
  testAccount,
  testCPAConnection,
  syncCPACapacity,
  refreshCredentials,
  applyOAuthCredentials,
  getStats,
  clearError: clearAccountError,
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
