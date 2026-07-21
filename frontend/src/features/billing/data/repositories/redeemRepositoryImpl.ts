/**
 * RedeemRepositoryImpl. Auto-generated from redeemDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/billing/data/datasources/redeemDatasource'
import type { RedeemRepository } from '@/features/billing/domain/repositories/redeemRepository'

export class RedeemRepositoryImpl implements RedeemRepository {
  get redeem(): typeof ds.redeem { return ds.redeem }
  get getHistory(): typeof ds.getHistory { return ds.getHistory }
}

export const redeemRepository: RedeemRepository = new RedeemRepositoryImpl()
