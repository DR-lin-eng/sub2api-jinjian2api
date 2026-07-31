import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PlatformQuotaLimits } from '@/features/admin-settings/domain/models/platformQuotaLimits'

export class PlatformQuotaLimitsDto {
  @Expose() @Transform(({ value }) => value ?? null) daily!: number | null
  @Expose() @Transform(({ value }) => value ?? null) weekly!: number | null
  @Expose() @Transform(({ value }) => value ?? null) monthly!: number | null

  static fromJson(json: unknown): PlatformQuotaLimitsDto {
    return plainToInstance(PlatformQuotaLimitsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PlatformQuotaLimits {
    const e = new PlatformQuotaLimits()
    e.daily = this.daily
    e.weekly = this.weekly
    e.monthly = this.monthly
    return e
  }
}
