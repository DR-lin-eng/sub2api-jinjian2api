import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AntigravityModelQuota } from '@/features/admin-accounts/domain/models/antigravityModelQuota'

export class AntigravityModelQuotaDto {
  @Expose() @Transform(({ value }) => value ?? 0) utilization!: number
  @Expose({ name: 'reset_time' }) @Transform(({ value }) => value ?? '') resetTime!: string

  static fromJson(json: unknown): AntigravityModelQuotaDto {
    return plainToInstance(AntigravityModelQuotaDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AntigravityModelQuota {
    const e = new AntigravityModelQuota()
    e.utilization = this.utilization
    e.resetTime = this.resetTime
    return e
  }
}
