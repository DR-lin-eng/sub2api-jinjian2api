import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpSetupResponse } from '@/features/profile/domain/models/totpSetupResponse'

export class TotpSetupResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  secret!: string

  @Expose({ name: 'qr_code_url' })
  @Transform(({ value }) => value ?? '')
  qrCodeUrl!: string

  @Expose({ name: 'setup_token' })
  @Transform(({ value }) => value ?? '')
  setupToken!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  countdown!: number

  static fromJson(json: unknown): TotpSetupResponseDto {
    return plainToInstance(TotpSetupResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpSetupResponse {
    const e = new TotpSetupResponse()
    e.secret = this.secret
    e.qrCodeUrl = this.qrCodeUrl
    e.setupToken = this.setupToken
    e.countdown = this.countdown
    return e
  }
}
