import { apiClient } from '@/core/networks/client'
import { AdminGroupDto } from '@/features/admin-groups/data/models/adminGroupDto'
import { CompositeModelRouteDto } from '@/features/admin-groups/data/models/compositeModelRouteDto'
import type { CreateGroupRequest } from '@/features/admin-groups/data/requests_models/createGroupRequest'
import type { UpdateGroupRequest } from '@/features/admin-groups/data/requests_models/updateGroupRequest'
import type { CreateCompositeRouteRequest } from '@/features/admin-groups/data/requests_models/createCompositeRouteRequest'

const duplicateOperationKeys = new Map<string, string>()

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

export class AdminGroupsActionDatasource {
  async create(req: CreateGroupRequest): Promise<AdminGroupDto> {
    const { data } = await apiClient.post<unknown>('/admin/groups', req)
    return AdminGroupDto.fromJson(data)
  }

  async duplicate(id: number): Promise<AdminGroupDto> {
    const adminID = getCurrentAdminID()
    const scopeKey = adminID ? `sub2api:admin:group-duplicate:${adminID}:${id}` : null
    let idempotencyKey = scopeKey
      ? duplicateOperationKeys.get(scopeKey) ?? getStoredDuplicateOperationKey(scopeKey)
      : null
    if (!idempotencyKey) {
      const requestID = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      idempotencyKey = `group-duplicate-${adminID ?? 'unknown-admin'}-${id}-${requestID}`
    }
    if (scopeKey) {
      duplicateOperationKeys.set(scopeKey, idempotencyKey)
      storeDuplicateOperationKey(scopeKey, idempotencyKey)
    }

    const { data } = await apiClient.post<unknown>(`/admin/groups/${id}/duplicate`, undefined, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })

    if (scopeKey) {
      duplicateOperationKeys.delete(scopeKey)
      storeDuplicateOperationKey(scopeKey, null)
    }
    return AdminGroupDto.fromJson(data)
  }

  async update(id: number, req: UpdateGroupRequest): Promise<AdminGroupDto> {
    const { data } = await apiClient.put<unknown>(`/admin/groups/${id}`, req)
    return AdminGroupDto.fromJson(data)
  }

  async deleteGroup(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/groups/${id}`)
    return data
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<AdminGroupDto> {
    return this.update(id, { status })
  }

  async createCompositeRoute(id: number, route: CreateCompositeRouteRequest): Promise<CompositeModelRouteDto> {
    const { data } = await apiClient.post<unknown>(`/admin/groups/${id}/composite-routes`, route)
    return CompositeModelRouteDto.fromJson(data)
  }

  async updateCompositeRoute(id: number, routeId: number, route: CreateCompositeRouteRequest): Promise<CompositeModelRouteDto> {
    const { data } = await apiClient.put<unknown>(`/admin/groups/${id}/composite-routes/${routeId}`, route)
    return CompositeModelRouteDto.fromJson(data)
  }

  async deleteCompositeRoute(id: number, routeId: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/admin/groups/${id}/composite-routes/${routeId}`,
    )
    return data
  }

  async updateSortOrder(updates: Array<{ id: number; sort_order: number }>): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>('/admin/groups/sort-order', { updates })
    return data
  }

  async clearGroupRateMultipliers(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/groups/${id}/rate-multipliers`)
    return data
  }

  async batchSetGroupRateMultipliers(
    id: number,
    entries: Array<{ user_id: number; rate_multiplier: number }>,
  ): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>(
      `/admin/groups/${id}/rate-multipliers`,
      { entries },
    )
    return data
  }

  async batchSetGroupRPMOverrides(
    id: number,
    entries: Array<{ user_id: number; rpm_override: number }>,
  ): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>(
      `/admin/groups/${id}/rpm-overrides`,
      { entries },
    )
    return data
  }

  async clearGroupRPMOverrides(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/groups/${id}/rpm-overrides`)
    return data
  }
}

export const adminGroupsActionDatasource = new AdminGroupsActionDatasource()
