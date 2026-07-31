import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsDistributedLockSettings } from '@/features/admin-ops/domain/models/opsDistributedLockSettings'

export class OpsDistributedLockSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? '') key!: string
  @Expose({ name: 'ttl_seconds' }) @Transform(({ value }) => value ?? 0) ttlSeconds!: number

  static fromJson(json: unknown): OpsDistributedLockSettingsDto {
    return plainToInstance(OpsDistributedLockSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsDistributedLockSettings {
    const e = new OpsDistributedLockSettings()
    e.enabled = this.enabled
    e.key = this.key
    e.ttlSeconds = this.ttlSeconds
    return e
  }
}
