/**
 * AdminChannelsRepositoryImpl. Auto-generated from adminChannelsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-channels/data/datasources/adminChannelsDatasource'
import type { AdminChannelsRepository } from '@/features/admin-channels/domain/repositories/adminChannelsRepository'

export class AdminChannelsRepositoryImpl implements AdminChannelsRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  remove = ds.remove
  getModelDefaultPricing = ds.getModelDefaultPricing
  syncPricingModels = ds.syncPricingModels
}

export const adminChannelsRepository: AdminChannelsRepository = new AdminChannelsRepositoryImpl()
