import type { TotpLogin2FARequest } from '@/features/profile/domain/models/totp'

export interface TotpLogin2FARequestDto {
  temp_token: string
  totp_code: string
}

export function toDto(entity: TotpLogin2FARequest): TotpLogin2FARequestDto {
  return {
    temp_token: entity.tempToken,
    totp_code: entity.totpCode,
  }
}
