import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpenAIQuotaResetResult } from '@/features/admin-accounts/domain/models/openAIQuotaResetResult'
import { OpenAIQuotaResetCreditDto } from '@/features/admin-accounts/data/models/openAIQuotaResetCreditDto'

export class OpenAIQuotaResetResultDto {
  @Expose() @Transform(({ value }) => value ?? '') code!: string
  @Expose() @Type(() => OpenAIQuotaResetCreditDto) credit?: OpenAIQuotaResetCreditDto
  @Expose({ name: 'windows_reset' }) @Transform(({ value }) => value ?? 0) windowsReset!: number

  static fromJson(json: unknown): OpenAIQuotaResetResultDto {
    return plainToInstance(OpenAIQuotaResetResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIQuotaResetResult {
    const e = new OpenAIQuotaResetResult()
    e.code = this.code
    e.credit = this.credit ? this.credit.toEntity() : undefined
    e.windowsReset = this.windowsReset
    return e
  }
}
