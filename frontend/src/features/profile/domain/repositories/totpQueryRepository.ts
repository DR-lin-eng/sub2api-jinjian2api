import type { TotpStatus } from '@/features/profile/domain/models/totpStatus'
import type { TotpVerificationMethod } from '@/features/profile/domain/models/totpVerificationMethod'

export interface TotpQueryRepository {
  getStatus(): Promise<TotpStatus>
  getVerificationMethod(): Promise<TotpVerificationMethod>
}
