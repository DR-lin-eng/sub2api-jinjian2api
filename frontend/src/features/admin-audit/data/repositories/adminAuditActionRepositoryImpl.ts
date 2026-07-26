/**
 * AdminAuditActionRepositoryImpl. Per spec §6.
 */
import { adminAuditActionDatasource } from '@/features/admin-audit/data/datasources/adminAuditActionDatasource'
import type { ClearAuditLogRequest } from '@/features/admin-audit/data/requests_models/clearAuditLogRequest'
import type { AdminAuditActionRepository } from '@/features/admin-audit/domain/repositories/adminAuditActionRepository'

export class AdminAuditActionRepositoryImpl implements AdminAuditActionRepository {
  private readonly ds = adminAuditActionDatasource

  clear = async (req: ClearAuditLogRequest) : Promise<{ deleted: number }>  => {
    return this.ds.clear(req)
  }
}

export const adminAuditActionRepository: AdminAuditActionRepository = new AdminAuditActionRepositoryImpl()
