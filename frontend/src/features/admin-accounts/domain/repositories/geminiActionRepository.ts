import type { GeminiAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/geminiAuthUrlRequest'
import type { GeminiExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/geminiExchangeCodeRequest'
import type { GeminiAuthUrlResponse } from '@/features/admin-accounts/domain/models/geminiAuthUrlResponse'
import type { GeminiTokenInfo } from '@/features/admin-accounts/domain/models/geminiTokenInfo'

export interface GeminiActionRepository {
  generateAuthUrl(payload: GeminiAuthUrlRequest): Promise<GeminiAuthUrlResponse>
  exchangeCode(payload: GeminiExchangeCodeRequest): Promise<GeminiTokenInfo>
}
