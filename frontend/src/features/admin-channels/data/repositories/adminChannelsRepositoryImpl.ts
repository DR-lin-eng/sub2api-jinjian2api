/**
 * AdminChannelsRepositoryImpl. Auto-generated from adminChannelsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-channels/data/datasources/adminChannelsDatasource'
import type { AdminChannelsRepository } from '@/features/admin-channels/domain/repositories/adminChannelsRepository'

export class AdminChannelsRepositoryImpl implements AdminChannelsRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get remove(): typeof ds.remove { return ds.remove }
  get getModelDefaultPricing(): typeof ds.getModelDefaultPricing { return ds.getModelDefaultPricing }
  get syncPricingModels(): typeof ds.syncPricingModels { return ds.syncPricingModels }
}

export const adminChannelsRepository: AdminChannelsRepository = new AdminChannelsRepositoryImpl()
