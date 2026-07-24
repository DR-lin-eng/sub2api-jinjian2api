/**
 * AdminAuditQueryRepositoryImpl. Per spec §6.
 */
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { adminAuditQueryDatasource } from '@/features/admin-audit/data/datasources/adminAuditQueryDatasource'
import type { ListAuditLogRequest } from '@/features/admin-audit/data/requests_models/listAuditLogRequest'
import type { AuditLog } from '@/features/admin-audit/domain/models/auditLog'
import type { AuditLogQuery } from '@/features/admin-audit/domain/models/auditLogQuery'
import type { AdminAuditQueryRepository } from '@/features/admin-audit/domain/repositories/adminAuditQueryRepository'

export class AdminAuditQueryRepositoryImpl implements AdminAuditQueryRepository {
  private readonly ds = adminAuditQueryDatasource

  async list(
    query: AuditLogQuery = {},
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AuditLog>> {
    const req: ListAuditLogRequest = {
      page: query.page,
      page_size: query.pageSize,
      start_time: query.startTime,
      end_time: query.endTime,
      actor_user_id: query.actorUserId,
      actor_email: query.actorEmail,
      auth_method: query.authMethod,
      action: query.action,
      method: query.method,
      client_ip: query.clientIp,
      success: query.success,
      q: query.q,
    }
    const dtoPage = await this.ds.list(req, options)
    return { ...dtoPage, items: dtoPage.items.map((dto) => dto.toEntity()) }
  }

  async getById(id: number): Promise<AuditLog> {
    return (await this.ds.getById(id)).toEntity()
  }
}

export const adminAuditQueryRepository: AdminAuditQueryRepository = new AdminAuditQueryRepositoryImpl()
