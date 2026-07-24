import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsAlertSilencingSettings } from '@/features/admin-ops/domain/models/opsAlertSilencingSettings'
import { OpsAlertSilencingEntryDto } from './opsAlertSilencingEntryDto'

export class OpsAlertSilencingSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'global_until_rfc3339' }) @Transform(({ value }) => value ?? '') globalUntilRfc3339!: string
  @Expose({ name: 'global_reason' }) @Transform(({ value }) => value ?? '') globalReason!: string
  @Expose() @Type(() => OpsAlertSilencingEntryDto) @Transform(({ value }) => value ?? []) entries!: OpsAlertSilencingEntryDto[]

  static fromJson(json: unknown): OpsAlertSilencingSettingsDto {
    return plainToInstance(OpsAlertSilencingSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsAlertSilencingSettings {
    const e = new OpsAlertSilencingSettings()
    e.enabled = this.enabled
    e.globalUntilRfc3339 = this.globalUntilRfc3339
    e.globalReason = this.globalReason
    e.entries = this.entries.map(d => d.toEntity())
    return e
  }
}
