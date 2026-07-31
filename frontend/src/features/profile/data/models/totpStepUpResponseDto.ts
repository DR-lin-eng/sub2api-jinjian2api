import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpStepUpResponse } from '@/features/profile/domain/models/totpStepUpResponse'

export class TotpStepUpResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  verified!: boolean

  @Expose({ name: 'expires_in' })
  @Transform(({ value }) => value ?? 0)
  expiresIn!: number

  static fromJson(json: unknown): TotpStepUpResponseDto {
    return plainToInstance(TotpStepUpResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpStepUpResponse {
    const e = new TotpStepUpResponse()
    e.verified = this.verified
    e.expiresIn = this.expiresIn
    return e
  }
}
