import type { LoginResponse } from '@/features/auth/domain/repositories/authActionRepository'
import type { TotpLoginResult } from '@/features/auth/domain/models/totpLoginResult'

export function isTotp2FARequired(r: LoginResponse): r is TotpLoginResult {
  return 'requires2fa' in r && (r as TotpLoginResult).requires2fa === true
}
