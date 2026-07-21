/**
 * AdminAuditRepository (interface). Auto-generated from adminAuditDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminAuditRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-audit/data/datasources/adminAuditDatasource'

export type AdminAuditRepository = {
  list: typeof ds.list
  get: typeof ds.get
  clear: typeof ds.clear
}
