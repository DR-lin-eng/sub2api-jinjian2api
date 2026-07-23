import { apiClient } from '@/core/networks/client'
import { ChannelMonitorDto } from '@/features/admin-channel-monitor/data/models/channelMonitorDto'
import { RunNowResponseDto } from '@/features/admin-channel-monitor/data/models/runNowResponseDto'
import type { CreateChannelMonitorRequest } from '@/features/admin-channel-monitor/data/requests_models/createChannelMonitorRequest'
import type { UpdateChannelMonitorRequest } from '@/features/admin-channel-monitor/data/requests_models/updateChannelMonitorRequest'

const duplicateOperationKeys = new Map<string, string>()

interface DuplicateOperationScope {
  adminID: string
  key: string
}

function getCurrentAdminID(): string | null {
  try {
    const rawUser = globalThis.localStorage?.getItem('auth_user')
    if (!rawUser) return null

    const user: unknown = JSON.parse(rawUser)
    if (typeof user !== 'object' || user === null) return null

    const id = (user as { id?: unknown }).id
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) return null
    return String(id)
  } catch {
    return null
  }
}

function duplicateOperationScope(id: number): DuplicateOperationScope | null {
  const adminID = getCurrentAdminID()
  if (!adminID) return null

  return {
    adminID,
    key: `sub2api:admin:channel-monitor-duplicate:${adminID}:${id}`,
  }
}

function getStoredDuplicateOperationKey(storageKey: string): string | null {
  try {
    return globalThis.sessionStorage?.getItem(storageKey) ?? null
  } catch {
    return null
  }
}

function storeDuplicateOperationKey(storageKey: string, key: string | null): void {
  try {
    if (key) globalThis.sessionStorage?.setItem(storageKey, key)
    else globalThis.sessionStorage?.removeItem(storageKey)
  } catch {
    // In-memory retry protection still works when browser storage is unavailable.
  }
}

export class AdminChannelMonitorActionDatasource {
  async create(req: CreateChannelMonitorRequest): Promise<ChannelMonitorDto> {
    const { data } = await apiClient.post<unknown>('/admin/channel-monitors', req)
    return ChannelMonitorDto.fromJson(data)
  }

  async update(id: number, req: UpdateChannelMonitorRequest): Promise<ChannelMonitorDto> {
    const { data } = await apiClient.put<unknown>(`/admin/channel-monitors/${id}`, req)
    return ChannelMonitorDto.fromJson(data)
  }

  async del(id: number): Promise<void> {
    await apiClient.delete(`/admin/channel-monitors/${id}`)
  }

  async runNow(id: number): Promise<RunNowResponseDto> {
    const { data } = await apiClient.post<unknown>(`/admin/channel-monitors/${id}/run`)
    return RunNowResponseDto.fromJson(data)
  }

  async duplicate(id: number): Promise<ChannelMonitorDto> {
    const scope = duplicateOperationScope(id)
    let idempotencyKey = scope
      ? duplicateOperationKeys.get(scope.key) ?? getStoredDuplicateOperationKey(scope.key)
      : null
    if (!idempotencyKey) {
      const requestID =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      idempotencyKey = `channel-monitor-duplicate-${scope?.adminID ?? 'unknown-admin'}-${id}-${requestID}`
    }
    if (scope) {
      duplicateOperationKeys.set(scope.key, idempotencyKey)
      storeDuplicateOperationKey(scope.key, idempotencyKey)
    }

    const { data } = await apiClient.post<unknown>(
      `/admin/channel-monitors/${id}/duplicate`,
      undefined,
      { headers: { 'Idempotency-Key': idempotencyKey } },
    )

    if (scope) {
      duplicateOperationKeys.delete(scope.key)
      storeDuplicateOperationKey(scope.key, null)
    }
    return ChannelMonitorDto.fromJson(data)
  }
}

export const adminChannelMonitorActionDatasource = new AdminChannelMonitorActionDatasource()
