/**
 * RedeemRepositoryImpl. Auto-generated from redeemDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/billing/data/datasources/redeemDatasource'
import type { RedeemRepository } from '@/features/billing/domain/repositories/redeemRepository'

export class RedeemRepositoryImpl implements RedeemRepository {
  redeem = ds.redeem
  getHistory = ds.getHistory
}

export const redeemRepository: RedeemRepository = new RedeemRepositoryImpl()
