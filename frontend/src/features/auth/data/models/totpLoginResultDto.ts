import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpLoginResult } from '@/features/auth/domain/models/totpLoginResult'

export class TotpLoginResultDto {
  @Expose({ name: 'requires_2fa' })
  @Transform(({ value }) => value ?? false)
  requires2fa!: boolean

  @Expose({ name: 'temp_token' })
  @Transform(({ value }) => value ?? '')
  tempToken!: string

  @Expose({ name: 'user_email_masked' })
  @Transform(({ value }) => value ?? '')
  userEmailMasked!: string

  static fromJson(json: unknown): TotpLoginResultDto {
    return plainToInstance(TotpLoginResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpLoginResult {
    const e = new TotpLoginResult()
    e.requires2fa = this.requires2fa
    e.tempToken = this.tempToken
    e.userEmailMasked = this.userEmailMasked
    return e
  }
}
