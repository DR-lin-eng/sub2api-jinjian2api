/**
 * AdminRedeemRepository (interface). Auto-generated from adminRedeemDatasource.ts.
 */
import type * as ds from '@/features/admin-redeem/data/datasources/adminRedeemDatasource'

export type AdminRedeemRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly generate: typeof ds.generate
  readonly deleteCode: typeof ds.deleteCode
  readonly batchDelete: typeof ds.batchDelete
  readonly batchUpdate: typeof ds.batchUpdate
  readonly expire: typeof ds.expire
  readonly getStats: typeof ds.getStats
  readonly exportCodes: typeof ds.exportCodes
}
