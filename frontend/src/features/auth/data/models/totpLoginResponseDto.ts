import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpLoginResponse } from '@/features/auth/domain/models/totpLoginResponse'

export class TotpLoginResponseDto {
  @Expose({ name: 'requires_2fa' })
  @Transform(({ value }) => value ?? false)
  requires2fa!: boolean

  @Expose({ name: 'temp_token' })
  tempToken?: string

  @Expose({ name: 'user_email_masked' })
  userEmailMasked?: string

  static fromJson(json: unknown): TotpLoginResponseDto {
    return plainToInstance(TotpLoginResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpLoginResponse {
    const e = new TotpLoginResponse()
    e.requires2fa = this.requires2fa
    e.tempToken = this.tempToken
    e.userEmailMasked = this.userEmailMasked
    return e
  }
}
