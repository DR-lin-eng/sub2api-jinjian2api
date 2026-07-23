import { geminiActionDatasource } from '@/features/admin-accounts/data/datasources/geminiActionDatasource'
import type { GeminiAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/geminiAuthUrlRequest'
import type { GeminiExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/geminiExchangeCodeRequest'
import type { GeminiAuthUrlResponse } from '@/features/admin-accounts/domain/models/geminiAuthUrlResponse'
import type { GeminiTokenInfo } from '@/features/admin-accounts/domain/models/geminiTokenInfo'
import type { GeminiActionRepository } from '@/features/admin-accounts/domain/repositories/geminiActionRepository'

export class GeminiActionRepositoryImpl implements GeminiActionRepository {
  private readonly ds = geminiActionDatasource

  async generateAuthUrl(payload: GeminiAuthUrlRequest): Promise<GeminiAuthUrlResponse> {
    return (await this.ds.generateAuthUrl(payload)).toEntity()
  }

  async exchangeCode(payload: GeminiExchangeCodeRequest): Promise<GeminiTokenInfo> {
    return (await this.ds.exchangeCode(payload)).toEntity()
  }
}

export const geminiActionRepository: GeminiActionRepository = new GeminiActionRepositoryImpl()
