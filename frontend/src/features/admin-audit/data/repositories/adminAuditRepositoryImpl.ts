/**
 * AdminAuditRepositoryImpl. Auto-generated from adminAuditDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-audit/data/datasources/adminAuditDatasource'
import type { AdminAuditRepository } from '@/features/admin-audit/domain/repositories/adminAuditRepository'

export class AdminAuditRepositoryImpl implements AdminAuditRepository {
  get list(): typeof ds.list { return ds.list }
  get get(): typeof ds.get { return ds.get }
  get clear(): typeof ds.clear { return ds.clear }
}

export const adminAuditRepository: AdminAuditRepository = new AdminAuditRepositoryImpl()
