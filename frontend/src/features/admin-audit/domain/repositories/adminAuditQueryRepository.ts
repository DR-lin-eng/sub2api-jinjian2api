/**
 * AdminAuditQueryRepository (interface). Per spec §6.
 */
import type { PaginatedResponse } from '@/types'
import type { AuditLog } from '@/features/admin-audit/domain/models/auditLog'
import type { AuditLogQuery } from '@/features/admin-audit/domain/models/auditLogQuery'

export interface AdminAuditQueryRepository {
  list(
    query?: AuditLogQuery,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AuditLog>>
  getById(id: number): Promise<AuditLog>
}
