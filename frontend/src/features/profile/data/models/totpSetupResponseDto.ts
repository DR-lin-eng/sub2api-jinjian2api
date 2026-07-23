import type { TotpSetupResponse } from '@/features/profile/domain/models/totp'

export interface TotpSetupResponseDto {
  secret: string
  qr_code_url: string
  setup_token: string
  countdown: number
}

export function toEntity(dto: TotpSetupResponseDto): TotpSetupResponse {
  return {
    secret: dto.secret ?? '',
    qrCodeUrl: dto.qr_code_url ?? '',
    setupToken: dto.setup_token ?? '',
    countdown: dto.countdown ?? 0,
  }
}
