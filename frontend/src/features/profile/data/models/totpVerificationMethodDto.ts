import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpVerificationMethod } from '@/features/profile/domain/models/totpVerificationMethod'

export class TotpVerificationMethodDto {
  @Expose()
  @Transform(({ value }) => value ?? 'password')
  method!: 'email' | 'password'

  static fromJson(json: unknown): TotpVerificationMethodDto {
    return plainToInstance(TotpVerificationMethodDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpVerificationMethod {
    const e = new TotpVerificationMethod()
    e.method = this.method
    return e
  }
}
