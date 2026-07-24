import { affiliateActionDatasource } from '@/features/affiliate/data/datasources/affiliateActionDatasource'
import type { SimpleUser } from '@/features/affiliate/domain/models/simpleUser'
import type { UpdateAffiliateUserRequest } from '@/features/affiliate/data/requests_models/updateAffiliateUserRequest'
import type { BatchSetRateRequest } from '@/features/affiliate/data/requests_models/batchSetRateRequest'
import type { AffiliateActionRepository } from '@/features/affiliate/domain/repositories/affiliateActionRepository'

class AffiliateActionRepositoryImpl implements AffiliateActionRepository {
  private readonly ds = affiliateActionDatasource

  async lookupUsers(q: string): Promise<SimpleUser[]> {
    return (await this.ds.lookupUsers(q)).map(dto => dto.toEntity())
  }

  async updateUserSettings(userId: number, req: UpdateAffiliateUserRequest): Promise<{ userId: number }> {
    return this.ds.updateUserSettings(userId, req)
  }

  async clearUserSettings(userId: number): Promise<{ userId: number }> {
    return this.ds.clearUserSettings(userId)
  }

  async batchSetRate(req: BatchSetRateRequest): Promise<{ affected: number }> {
    return this.ds.batchSetRate(req)
  }
}

export const affiliateActionRepository: AffiliateActionRepository = new AffiliateActionRepositoryImpl()
