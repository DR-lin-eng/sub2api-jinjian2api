/**
 * Admin Audit Query Datasource — GET endpoints only. Per spec §4.
 *
 * The audit log is admin-only (not exposed to end users). It records
 * management-plane operations with masked header credentials and redacted
 * request bodies.
 */
import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AuditLogDto } from '@/features/admin-audit/data/models/auditLogDto'
import type { ListAuditLogRequest } from '@/features/admin-audit/data/requests_models/listAuditLogRequest'

export class AdminAuditQueryDatasource {
  async list(
    params: ListAuditLogRequest,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AuditLogDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/audit-logs', {
      params,
      signal: options?.signal,
    })
    return {
      ...data,
      items: (data.items ?? []).map((item) => AuditLogDto.fromJson(item)),
    }
  }

  async getById(id: number): Promise<AuditLogDto> {
    const { data } = await apiClient.get<unknown>(`/admin/audit-logs/${id}`)
    return AuditLogDto.fromJson(data)
  }
}

export const adminAuditQueryDatasource = new AdminAuditQueryDatasource()
