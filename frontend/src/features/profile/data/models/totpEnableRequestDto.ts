import type { TotpEnableRequest } from '@/features/profile/domain/models/totp'

export interface TotpEnableRequestDto {
  totp_code: string
  setup_token: string
}

export function toDto(entity: TotpEnableRequest): TotpEnableRequestDto {
  return {
    totp_code: entity.totpCode,
    setup_token: entity.setupToken,
  }
}
