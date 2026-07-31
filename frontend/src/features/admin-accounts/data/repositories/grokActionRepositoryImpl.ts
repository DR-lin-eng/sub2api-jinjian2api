import { grokActionDatasource } from '@/features/admin-accounts/data/datasources/grokActionDatasource'
import type { GrokAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/grokAuthUrlRequest'
import type { GrokExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/grokExchangeCodeRequest'
import type { GrokSSOToOAuthRequest } from '@/features/admin-accounts/data/requests_models/grokSSOToOAuthRequest'
import type { GrokAuthUrlResponse } from '@/features/admin-accounts/domain/models/grokAuthUrlResponse'
import type { GrokTokenInfo } from '@/features/admin-accounts/domain/models/grokTokenInfo'
import type { GrokSSOToOAuthResponse } from '@/features/admin-accounts/domain/models/grokSSOToOAuthResponse'
import type { GrokQuotaResetResult } from '@/features/admin-accounts/domain/models/grokQuotaResetResult'
import type { GrokActionRepository } from '@/features/admin-accounts/domain/repositories/grokActionRepository'

export class GrokActionRepositoryImpl implements GrokActionRepository {
  private readonly ds = grokActionDatasource

  generateAuthUrl = async (payload: GrokAuthUrlRequest) : Promise<GrokAuthUrlResponse>  => {
    return (await this.ds.generateAuthUrl(payload)).toEntity()
  }

  exchangeCode = async (payload: GrokExchangeCodeRequest) : Promise<GrokTokenInfo>  => {
    return (await this.ds.exchangeCode(payload)).toEntity()
  }

  refreshGrokToken = async (refreshToken: string, proxyId?: number | null) : Promise<GrokTokenInfo>  => {
    return (await this.ds.refreshGrokToken(refreshToken, proxyId)).toEntity()
  }

  resetQuota = async (id: number) : Promise<GrokQuotaResetResult>  => {
    return (await this.ds.resetQuota(id)).toEntity()
  }

  createFromSSO = async (payload: GrokSSOToOAuthRequest) : Promise<GrokSSOToOAuthResponse>  => {
    return (await this.ds.createFromSSO(payload)).toEntity()
  }
}

export const grokActionRepository: GrokActionRepository = new GrokActionRepositoryImpl()
