/**
 * AdminChannelsRepository (interface). Auto-generated from adminChannelsDatasource.ts.
 */
import type * as ds from '@/features/admin-channels/data/datasources/adminChannelsDatasource'

export type AdminChannelsRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly remove: typeof ds.remove
  readonly getModelDefaultPricing: typeof ds.getModelDefaultPricing
  readonly syncPricingModels: typeof ds.syncPricingModels
}
