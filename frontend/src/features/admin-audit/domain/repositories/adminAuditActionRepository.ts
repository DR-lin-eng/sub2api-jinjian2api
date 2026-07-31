/**
 * AdminAuditActionRepository (interface). Per spec §6.
 */
import type { ClearAuditLogRequest } from '@/features/admin-audit/data/requests_models/clearAuditLogRequest'

export interface AdminAuditActionRepository {
  clear(req: ClearAuditLogRequest): Promise<{ deleted: number }>
}
