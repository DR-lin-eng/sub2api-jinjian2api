import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GrokQuotaResetResult } from '@/features/admin-accounts/domain/models/grokQuotaResetResult'

export class GrokQuotaResetResultDto {
  @Expose() @Transform(({ value }) => value ?? false) supported!: boolean
  @Expose() @Transform(({ value }) => value ?? '') code!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string

  static fromJson(json: unknown): GrokQuotaResetResultDto {
    return plainToInstance(GrokQuotaResetResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokQuotaResetResult {
    const e = new GrokQuotaResetResult()
    e.supported = this.supported
    e.code = this.code
    e.message = this.message
    return e
  }
}
