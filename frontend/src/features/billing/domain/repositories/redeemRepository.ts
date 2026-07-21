/**
 * RedeemRepository (interface). Auto-generated from redeemDatasource.ts.
 */
import type * as ds from '@/features/billing/data/datasources/redeemDatasource'

export type RedeemRepository = {
  readonly redeem: typeof ds.redeem
  readonly getHistory: typeof ds.getHistory
}
