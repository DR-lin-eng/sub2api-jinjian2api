import { geminiQueryDatasource } from '@/features/admin-accounts/data/datasources/geminiQueryDatasource'
import type { GeminiOAuthCapabilities } from '@/features/admin-accounts/domain/models/geminiOAuthCapabilities'
import type { GeminiQueryRepository } from '@/features/admin-accounts/domain/repositories/geminiQueryRepository'

export class GeminiQueryRepositoryImpl implements GeminiQueryRepository {
  private readonly ds = geminiQueryDatasource

  getCapabilities = async () : Promise<GeminiOAuthCapabilities>  => {
    return (await this.ds.getCapabilities()).toEntity()
  }
}

export const geminiQueryRepository: GeminiQueryRepository = new GeminiQueryRepositoryImpl()
