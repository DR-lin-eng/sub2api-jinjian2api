import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsAlertRuntimeSettings } from '@/features/admin-ops/domain/models/opsAlertRuntimeSettings'
import { OpsDistributedLockSettings } from '@/features/admin-ops/domain/models/opsDistributedLockSettings'
import { OpsAlertSilencingSettings } from '@/features/admin-ops/domain/models/opsAlertSilencingSettings'
import { OpsMetricThresholds } from '@/features/admin-ops/domain/models/opsMetricThresholds'
import { OpsDistributedLockSettingsDto } from './opsDistributedLockSettingsDto'
import { OpsAlertSilencingSettingsDto } from './opsAlertSilencingSettingsDto'
import { OpsMetricThresholdsDto } from './opsMetricThresholdsDto'

export class OpsAlertRuntimeSettingsDto {
  @Expose({ name: 'evaluation_interval_seconds' }) @Transform(({ value }) => value ?? 0) evaluationIntervalSeconds!: number
  @Expose({ name: 'distributed_lock' }) @Type(() => OpsDistributedLockSettingsDto) distributedLock!: OpsDistributedLockSettingsDto
  @Expose() @Type(() => OpsAlertSilencingSettingsDto) silencing!: OpsAlertSilencingSettingsDto
  @Expose() @Type(() => OpsMetricThresholdsDto) thresholds!: OpsMetricThresholdsDto

  static fromJson(json: unknown): OpsAlertRuntimeSettingsDto {
    return plainToInstance(OpsAlertRuntimeSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsAlertRuntimeSettings {
    const e = new OpsAlertRuntimeSettings()
    e.evaluationIntervalSeconds = this.evaluationIntervalSeconds

    const dl = new OpsDistributedLockSettings()
    dl.enabled = this.distributedLock?.enabled ?? false
    dl.key = this.distributedLock?.key ?? ''
    dl.ttlSeconds = this.distributedLock?.ttlSeconds ?? 0
    e.distributedLock = this.distributedLock ? this.distributedLock.toEntity() : dl

    const s = new OpsAlertSilencingSettings()
    s.enabled = false
    s.globalUntilRfc3339 = ''
    s.globalReason = ''
    s.entries = []
    e.silencing = this.silencing ? this.silencing.toEntity() : s

    const t = new OpsMetricThresholds()
    t.slaPercentMin = 0
    t.ttftP99MsMax = 0
    t.requestErrorRatePercentMax = 0
    t.upstreamErrorRatePercentMax = 0
    e.thresholds = this.thresholds ? this.thresholds.toEntity() : t

    return e
  }
}
