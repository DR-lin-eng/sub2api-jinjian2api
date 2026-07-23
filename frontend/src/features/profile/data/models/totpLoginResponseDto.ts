import type { TotpLoginResponse } from '@/features/profile/domain/models/totp'

export interface TotpLoginResponseDto {
  requires_2fa: boolean
  temp_token?: string
  user_email_masked?: string
}

export function toEntity(dto: TotpLoginResponseDto): TotpLoginResponse {
  return {
    requires2fa: dto.requires_2fa ?? false,
    tempToken: dto.temp_token,
    userEmailMasked: dto.user_email_masked,
  }
}
