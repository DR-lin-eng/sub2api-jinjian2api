/**
 * AdminAuditRepository (interface). Auto-generated from adminAuditDatasource.ts.
 */
import type * as ds from '@/features/admin-audit/data/datasources/adminAuditDatasource'

export type AdminAuditRepository = {
  readonly list: typeof ds.list
  readonly get: typeof ds.get
  readonly clear: typeof ds.clear
}
