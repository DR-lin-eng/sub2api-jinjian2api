/**
 * AdminPromoRepositoryImpl. Auto-generated from adminPromoDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-promo/data/datasources/adminPromoDatasource'
import type { AdminPromoRepository } from '@/features/admin-promo/domain/repositories/adminPromoRepository'

export class AdminPromoRepositoryImpl implements AdminPromoRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteCode(): typeof ds.deleteCode { return ds.deleteCode }
  get getUsages(): typeof ds.getUsages { return ds.getUsages }
}

export const adminPromoRepository: AdminPromoRepository = new AdminPromoRepositoryImpl()
