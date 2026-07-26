import { antigravityActionDatasource } from '@/features/admin-accounts/data/datasources/antigravityActionDatasource'
import type { AntigravityAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/antigravityAuthUrlRequest'
import type { AntigravityExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/antigravityExchangeCodeRequest'
import type { AntigravityAuthUrlResponse } from '@/features/admin-accounts/domain/models/antigravityAuthUrlResponse'
import type { AntigravityTokenInfo } from '@/features/admin-accounts/domain/models/antigravityTokenInfo'
import type { AntigravityActionRepository } from '@/features/admin-accounts/domain/repositories/antigravityActionRepository'

export class AntigravityActionRepositoryImpl implements AntigravityActionRepository {
  private readonly ds = antigravityActionDatasource

  generateAuthUrl = async (payload: AntigravityAuthUrlRequest) : Promise<AntigravityAuthUrlResponse>  => {
    return (await this.ds.generateAuthUrl(payload)).toEntity()
  }

  exchangeCode = async (payload: AntigravityExchangeCodeRequest) : Promise<AntigravityTokenInfo>  => {
    return (await this.ds.exchangeCode(payload)).toEntity()
  }

  refreshAntigravityToken = async (refreshToken: string, proxyId?: number | null) : Promise<AntigravityTokenInfo>  => {
    return (await this.ds.refreshAntigravityToken(refreshToken, proxyId)).toEntity()
  }
}

export const antigravityActionRepository: AntigravityActionRepository = new AntigravityActionRepositoryImpl()
