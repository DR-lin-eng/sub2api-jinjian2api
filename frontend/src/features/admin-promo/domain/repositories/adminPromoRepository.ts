/**
 * AdminPromoRepository (interface). Auto-generated from adminPromoDatasource.ts.
 */
import type * as ds from '@/features/admin-promo/data/datasources/adminPromoDatasource'

export type AdminPromoRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteCode: typeof ds.deleteCode
  readonly getUsages: typeof ds.getUsages
}
