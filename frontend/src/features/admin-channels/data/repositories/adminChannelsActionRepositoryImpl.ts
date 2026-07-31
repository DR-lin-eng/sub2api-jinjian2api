import { adminChannelsActionDatasource } from '@/features/admin-channels/data/datasources/adminChannelsActionDatasource'
import type { Channel } from '@/features/admin-channels/domain/models/channel'
import type { SyncPricingModelsResult } from '@/features/admin-channels/domain/models/syncPricingModelsResult'
import type { CreateChannelRequest } from '@/features/admin-channels/data/requests_models/createChannelRequest'
import type { UpdateChannelRequest } from '@/features/admin-channels/data/requests_models/updateChannelRequest'
import type { AdminChannelsActionRepository } from '@/features/admin-channels/domain/repositories/adminChannelsActionRepository'

export class AdminChannelsActionRepositoryImpl implements AdminChannelsActionRepository {
  private readonly ds = adminChannelsActionDatasource

  create = async (req: CreateChannelRequest) : Promise<Channel>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateChannelRequest) : Promise<Channel>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  remove = async (id: number) : Promise<void>  => {
    await this.ds.remove(id)
  }

  syncPricingModels = async (platform: string) : Promise<SyncPricingModelsResult>  => {
    return (await this.ds.syncPricingModels(platform)).toEntity()
  }
}

export const adminChannelsActionRepository: AdminChannelsActionRepository = new AdminChannelsActionRepositoryImpl()
