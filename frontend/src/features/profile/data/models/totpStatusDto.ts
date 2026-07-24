import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TotpStatus } from '@/features/profile/domain/models/totpStatus'

export class TotpStatusDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  @Expose({ name: 'enabled_at' })
  @Transform(({ value }) => value ?? 0)
  enabledAt!: number

  @Expose({ name: 'feature_enabled' })
  @Transform(({ value }) => value ?? false)
  featureEnabled!: boolean

  static fromJson(json: unknown): TotpStatusDto {
    return plainToInstance(TotpStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TotpStatus {
    const e = new TotpStatus()
    e.enabled = this.enabled
    e.enabledAt = this.enabledAt
    e.featureEnabled = this.featureEnabled
    return e
  }
}
