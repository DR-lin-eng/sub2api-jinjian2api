import type { Channel } from '@/features/admin-channels/domain/models/channel'
import type { SyncPricingModelsResult } from '@/features/admin-channels/domain/models/syncPricingModelsResult'
import type { CreateChannelRequest } from '@/features/admin-channels/data/requests_models/createChannelRequest'
import type { UpdateChannelRequest } from '@/features/admin-channels/data/requests_models/updateChannelRequest'

export interface AdminChannelsActionRepository {
  create(req: CreateChannelRequest): Promise<Channel>
  update(id: number, req: UpdateChannelRequest): Promise<Channel>
  remove(id: number): Promise<void>
  syncPricingModels(platform: string): Promise<SyncPricingModelsResult>
}
