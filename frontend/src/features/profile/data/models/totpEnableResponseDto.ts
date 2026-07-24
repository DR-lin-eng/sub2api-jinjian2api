import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpEnableResponse } from '@/features/profile/domain/models/totpEnableResponse'

export class TotpEnableResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  success!: boolean

  static fromJson(json: unknown): TotpEnableResponseDto {
    return plainToInstance(TotpEnableResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpEnableResponse {
    const e = new TotpEnableResponse()
    e.success = this.success
    return e
  }
}
