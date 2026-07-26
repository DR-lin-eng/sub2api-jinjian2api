import 'reflect-metadata'
import { Expose, Type, plainToInstance } from 'class-transformer'
import { OpsSettingsSnapshot } from '@/features/admin-ops/domain/models/opsSettingsSnapshot'
import { OpsAlertRuntimeSettingsDto } from './opsAlertRuntimeSettingsDto'
import { EmailNotificationConfigDto } from './emailNotificationConfigDto'
import { OpsAdvancedSettingsDto } from './opsAdvancedSettingsDto'
import { OpsMetricThresholdsDto } from './opsMetricThresholdsDto'

export class OpsSettingsSnapshotDto {
  @Expose() @Type(() => OpsAlertRuntimeSettingsDto) runtime!: OpsAlertRuntimeSettingsDto
  @Expose() @Type(() => EmailNotificationConfigDto) email!: EmailNotificationConfigDto
  @Expose() @Type(() => OpsAdvancedSettingsDto) advanced!: OpsAdvancedSettingsDto
  @Expose({ name: 'metric_thresholds' }) @Type(() => OpsMetricThresholdsDto) metricThresholds!: OpsMetricThresholdsDto | null

  static fromJson(json: unknown): OpsSettingsSnapshotDto {
    return plainToInstance(OpsSettingsSnapshotDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsSettingsSnapshot {
    const e = new OpsSettingsSnapshot()
    e.runtime = this.runtime.toEntity()
    e.email = this.email.toEntity()
    e.advanced = this.advanced.toEntity()
    e.metricThresholds = this.metricThresholds ? this.metricThresholds.toEntity() : null
    return e
  }
}
