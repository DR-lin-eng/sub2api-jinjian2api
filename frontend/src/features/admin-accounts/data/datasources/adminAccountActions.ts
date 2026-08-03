import { apiClient } from '@/core/networks/client'
import type {
  Account,
  AdminDataPayload,
  CheckMixedChannelRequest,
  CheckMixedChannelResponse,
  OllamaCloudUsageSettings,
  OllamaCloudUsageState,
  UpstreamBillingProbeResult,
  UpstreamQuotaQueryResult
} from '@/types'

export interface CPACapacityStatus {
  total_credentials: number
  enabled_credentials: number
  abnormal_credentials: number
  available_credentials: number
  effective_concurrency: number
  concurrency_per_credential: number
  fetched_at?: string
  state: 'fresh' | 'stale' | 'unavailable'
}

export interface BatchOperationResult {
  total: number
  success: number
  failed: number
  success_ids?: number[]
  failed_ids?: number[]
  errors?: Array<{ account_id: number; error: string }>
  warnings?: Array<{ account_id: number; warning: string }>
}

export interface BulkUpdateResult {
  success: number
  failed: number
  success_ids?: number[]
  failed_ids?: number[]
  results: Array<{ account_id: number; success: boolean; error?: string }>
}

export interface AccountExportOptions {
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
}

export interface SparkShadowCreatePayload {
  name?: string
  priority?: number
  concurrency?: number
  group_ids?: number[]
}

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

export async function duplicate(id: number): Promise<Account> {
  let idempotencyKey = duplicateOperationKeys.get(id) ?? getStoredDuplicateOperationKey(id)
  if (!idempotencyKey) {
    const requestID = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    idempotencyKey = `account-duplicate-${id}-${requestID}`
  }
  duplicateOperationKeys.set(id, idempotencyKey)
  storeDuplicateOperationKey(id, idempotencyKey)
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/duplicate`, undefined, {
    headers: { 'Idempotency-Key': idempotencyKey }
  })
  duplicateOperationKeys.delete(id)
  storeDuplicateOperationKey(id, null)
  return data
}

export async function deleteAccount(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/admin/accounts/${id}`)
  return data
}

export async function syncCPACapacity(id: number): Promise<CPACapacityStatus> {
  const { data } = await apiClient.post<CPACapacityStatus>(`/admin/accounts/${id}/cpa/sync`)
  return data
}

export async function refreshCredentials(id: number): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/refresh`)
  return data
}

export async function recoverState(id: number): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/recover-state`)
  return data
}

export async function resetAccountQuota(id: number): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/reset-quota`)
  return data
}

export async function bulkUpdate(
  accountIdsOrPayload: number[] | Record<string, unknown>,
  updates?: Record<string, unknown>
): Promise<BulkUpdateResult> {
  const payload = Array.isArray(accountIdsOrPayload)
    ? { account_ids: accountIdsOrPayload, ...(updates ?? {}) }
    : accountIdsOrPayload
  const { data } = await apiClient.post<BulkUpdateResult>('/admin/accounts/bulk-update', payload)
  return data
}

export async function checkMixedChannelRisk(
  payload: CheckMixedChannelRequest
): Promise<CheckMixedChannelResponse> {
  const { data } = await apiClient.post<CheckMixedChannelResponse>(
    '/admin/accounts/check-mixed-channel',
    payload
  )
  return data
}

export async function setSchedulable(id: number, schedulable: boolean): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/schedulable`, { schedulable })
  return data
}

export async function exportData(options?: AccountExportOptions): Promise<AdminDataPayload> {
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
  if (options?.includeProxies === false) params.include_proxies = 'false'

  const { data } = await apiClient.get<AdminDataPayload>('/admin/accounts/data', { params })
  return data
}

export async function batchDelete(accountIds: number[]): Promise<BatchOperationResult> {
  const { data } = await apiClient.post<BatchOperationResult>('/admin/accounts/batch-delete', {
    account_ids: accountIds
  })
  return data
}

export async function revertProxyFallback(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(`/admin/accounts/${id}/revert-proxy-fallback`)
  return data
}

export async function batchClearError(accountIds: number[]): Promise<BatchOperationResult> {
  const { data } = await apiClient.post<BatchOperationResult>('/admin/accounts/batch-clear-error', {
    account_ids: accountIds
  })
  return data
}

export async function batchRefresh(accountIds: number[]): Promise<BatchOperationResult> {
  const { data } = await apiClient.post<BatchOperationResult>('/admin/accounts/batch-refresh', {
    account_ids: accountIds
  }, {
    timeout: 120000
  })
  return data
}

export async function setPrivacy(id: number): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${id}/set-privacy`)
  return data
}

export async function createSparkShadow(parentId: number, payload: SparkShadowCreatePayload): Promise<Account> {
  const { data } = await apiClient.post<Account>(`/admin/accounts/${parentId}/shadow`, payload)
  return data
}

export async function probeUpstreamBilling(id: number): Promise<UpstreamBillingProbeResult> {
  const { data } = await apiClient.post<UpstreamBillingProbeResult>(`/admin/accounts/${id}/upstream-billing-probe`)
  return data
}

export async function probeUpstreamBillingBatch(accountIds: number[]): Promise<UpstreamBillingProbeResult[]> {
  const { data } = await apiClient.post<{ results: UpstreamBillingProbeResult[] }>(
    '/admin/accounts/upstream-billing-probe/batch',
    { account_ids: accountIds },
    { timeout: 120000 }
  )
  return data.results
}

export async function queryUpstreamQuota(id: number): Promise<UpstreamQuotaQueryResult> {
  const { data } = await apiClient.post<UpstreamQuotaQueryResult>(`/admin/accounts/${id}/upstream-quota/query`)
  return data
}

export async function updateOllamaCloudUsageSettings(
  settings: OllamaCloudUsageSettings
): Promise<OllamaCloudUsageSettings> {
  const { data } = await apiClient.put<OllamaCloudUsageSettings>(
    '/admin/accounts/ollama-cloud-usage/settings',
    settings
  )
  return data
}

export async function saveOllamaCloudUsageSession(
  id: number,
  session: string
): Promise<OllamaCloudUsageState> {
  const { data } = await apiClient.put<OllamaCloudUsageState>(
    `/admin/accounts/${id}/ollama-cloud-usage/session`,
    { session }
  )
  return data
}

export async function deleteOllamaCloudUsageSession(id: number): Promise<OllamaCloudUsageState> {
  const { data } = await apiClient.delete<OllamaCloudUsageState>(
    `/admin/accounts/${id}/ollama-cloud-usage/session`
  )
  return data
}

export async function setOllamaCloudUsageAutoRefresh(
  id: number,
  enabled: boolean
): Promise<OllamaCloudUsageState> {
  const { data } = await apiClient.put<OllamaCloudUsageState>(
    `/admin/accounts/${id}/ollama-cloud-usage/auto-refresh`,
    { enabled }
  )
  return data
}

export async function refreshOllamaCloudUsage(id: number): Promise<OllamaCloudUsageState> {
  const { data } = await apiClient.post<OllamaCloudUsageState>(
    `/admin/accounts/${id}/ollama-cloud-usage/refresh`
  )
  return data
}
