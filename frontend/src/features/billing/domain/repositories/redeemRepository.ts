/**
 * RedeemRepository (interface). Auto-generated from redeemDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/redeemRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/billing/data/datasources/redeemDatasource'

export type RedeemRepository = {
  redeem: typeof ds.redeem
  getHistory: typeof ds.getHistory
}
