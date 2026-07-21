/**
 * AdminChannelsRepository (interface). Auto-generated from adminChannelsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminChannelsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-channels/data/datasources/adminChannelsDatasource'

export type AdminChannelsRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  remove: typeof ds.remove
  getModelDefaultPricing: typeof ds.getModelDefaultPricing
  syncPricingModels: typeof ds.syncPricingModels
}
