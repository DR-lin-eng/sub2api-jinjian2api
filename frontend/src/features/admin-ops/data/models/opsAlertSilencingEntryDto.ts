import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsAlertSilencingEntry } from '@/features/admin-ops/domain/models/opsAlertSilencingEntry'

export class OpsAlertSilencingEntryDto {
  @Expose({ name: 'rule_id' }) @Transform(({ value }) => value ?? 0) ruleId!: number
  @Expose() @Transform(({ value }) => value ?? []) severities!: string[]
  @Expose({ name: 'until_rfc3339' }) @Transform(({ value }) => value ?? '') untilRfc3339!: string
  @Expose() @Transform(({ value }) => value ?? '') reason!: string

  static fromJson(json: unknown): OpsAlertSilencingEntryDto {
    return plainToInstance(OpsAlertSilencingEntryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsAlertSilencingEntry {
    const e = new OpsAlertSilencingEntry()
    e.ruleId = this.ruleId
    e.severities = this.severities
    e.untilRfc3339 = this.untilRfc3339
    e.reason = this.reason
    return e
  }
}
