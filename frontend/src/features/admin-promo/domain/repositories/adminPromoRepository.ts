/**
 * AdminPromoRepository (interface). Auto-generated from adminPromoDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminPromoRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-promo/data/datasources/adminPromoDatasource'

export type AdminPromoRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteCode: typeof ds.deleteCode
  getUsages: typeof ds.getUsages
}
