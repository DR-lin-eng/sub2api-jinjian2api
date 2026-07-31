import type { AntigravityAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/antigravityAuthUrlRequest'
import type { AntigravityExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/antigravityExchangeCodeRequest'
import type { AntigravityAuthUrlResponse } from '@/features/admin-accounts/domain/models/antigravityAuthUrlResponse'
import type { AntigravityTokenInfo } from '@/features/admin-accounts/domain/models/antigravityTokenInfo'

export interface AntigravityActionRepository {
  generateAuthUrl(payload: AntigravityAuthUrlRequest): Promise<AntigravityAuthUrlResponse>
  exchangeCode(payload: AntigravityExchangeCodeRequest): Promise<AntigravityTokenInfo>
  refreshAntigravityToken(refreshToken: string, proxyId?: number | null): Promise<AntigravityTokenInfo>
}
