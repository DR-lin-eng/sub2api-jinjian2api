import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GrokQuotaWindow } from '@/features/admin-accounts/domain/models/grokQuotaWindow'

export class GrokQuotaWindowDto {
  @Expose() @Transform(({ value }) => value ?? 0) limit!: number
  @Expose() @Transform(({ value }) => value ?? 0) remaining!: number
  @Expose({ name: 'reset_unix' }) @Transform(({ value }) => value ?? 0) resetUnix!: number
  @Expose({ name: 'reset_at' }) @Transform(({ value }) => value ?? '') resetAt!: string

  static fromJson(json: unknown): GrokQuotaWindowDto {
    return plainToInstance(GrokQuotaWindowDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokQuotaWindow {
    const e = new GrokQuotaWindow()
    e.limit = this.limit
    e.remaining = this.remaining
    e.resetUnix = this.resetUnix
    e.resetAt = this.resetAt
    return e
  }
}
