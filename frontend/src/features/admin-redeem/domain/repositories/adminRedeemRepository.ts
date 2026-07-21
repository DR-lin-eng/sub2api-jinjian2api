/**
 * AdminRedeemRepository (interface). Auto-generated from adminRedeemDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminRedeemRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-redeem/data/datasources/adminRedeemDatasource'

export type AdminRedeemRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  generate: typeof ds.generate
  deleteCode: typeof ds.deleteCode
  batchDelete: typeof ds.batchDelete
  batchUpdate: typeof ds.batchUpdate
  expire: typeof ds.expire
  getStats: typeof ds.getStats
  exportCodes: typeof ds.exportCodes
}
