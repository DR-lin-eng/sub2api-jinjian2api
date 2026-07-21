/**
 * AdminAuditRepositoryImpl. Auto-generated from adminAuditDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-audit/data/datasources/adminAuditDatasource'
import type { AdminAuditRepository } from '@/features/admin-audit/domain/repositories/adminAuditRepository'

export class AdminAuditRepositoryImpl implements AdminAuditRepository {
  list = ds.list
  get = ds.get
  clear = ds.clear
}

export const adminAuditRepository: AdminAuditRepository = new AdminAuditRepositoryImpl()
