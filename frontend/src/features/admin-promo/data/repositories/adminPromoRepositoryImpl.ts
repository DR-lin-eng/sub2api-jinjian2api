/**
 * AdminPromoRepositoryImpl. Auto-generated from adminPromoDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-promo/data/datasources/adminPromoDatasource'
import type { AdminPromoRepository } from '@/features/admin-promo/domain/repositories/adminPromoRepository'

export class AdminPromoRepositoryImpl implements AdminPromoRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteCode = ds.deleteCode
  getUsages = ds.getUsages
}

export const adminPromoRepository: AdminPromoRepository = new AdminPromoRepositoryImpl()
