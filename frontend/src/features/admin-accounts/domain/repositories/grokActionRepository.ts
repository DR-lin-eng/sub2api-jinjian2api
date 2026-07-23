import type { GrokAuthUrlRequest } from '@/features/admin-accounts/data/requests_models/grokAuthUrlRequest'
import type { GrokExchangeCodeRequest } from '@/features/admin-accounts/data/requests_models/grokExchangeCodeRequest'
import type { GrokSSOToOAuthRequest } from '@/features/admin-accounts/data/requests_models/grokSSOToOAuthRequest'
import type { GrokAuthUrlResponse } from '@/features/admin-accounts/domain/models/grokAuthUrlResponse'
import type { GrokTokenInfo } from '@/features/admin-accounts/domain/models/grokTokenInfo'
import type { GrokSSOToOAuthResponse } from '@/features/admin-accounts/domain/models/grokSSOToOAuthResponse'
import type { GrokQuotaResetResult } from '@/features/admin-accounts/domain/models/grokQuotaResetResult'

export interface GrokActionRepository {
  generateAuthUrl(payload: GrokAuthUrlRequest): Promise<GrokAuthUrlResponse>
  exchangeCode(payload: GrokExchangeCodeRequest): Promise<GrokTokenInfo>
  refreshGrokToken(refreshToken: string, proxyId?: number | null): Promise<GrokTokenInfo>
  resetQuota(id: number): Promise<GrokQuotaResetResult>
  createFromSSO(payload: GrokSSOToOAuthRequest): Promise<GrokSSOToOAuthResponse>
}
