/**
 * Admin Audit Action Datasource — write endpoints (POST). Per spec §4.
 *
 * Entries cannot be deleted individually; the whole log can only be cleared
 * with a fresh TOTP verification.
 */
import { apiClient } from '@/core/networks/client'
import type { ClearAuditLogRequest } from '@/features/admin-audit/data/requests_models/clearAuditLogRequest'

export class AdminAuditActionDatasource {
  /**
   * Clear all audit logs. Requires a fresh TOTP code (verified server-side);
   * unavailable when 2FA is not enabled for the operator.
   */
  async clear(req: ClearAuditLogRequest): Promise<{ deleted: number }> {
    const { data } = await apiClient.post<{ deleted: number }>('/admin/audit-logs/clear', req)
    return data
  }
}

export const adminAuditActionDatasource = new AdminAuditActionDatasource()
