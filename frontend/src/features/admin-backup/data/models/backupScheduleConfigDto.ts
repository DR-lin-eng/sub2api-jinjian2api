import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BackupScheduleConfig } from '@/features/admin-backup/domain/models/backupScheduleConfig'

export class BackupScheduleConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'cron_expr' }) @Transform(({ value }) => value ?? '') cronExpr!: string
  @Expose({ name: 'retain_days' }) @Transform(({ value }) => value ?? 0) retainDays!: number
  @Expose({ name: 'retain_count' }) @Transform(({ value }) => value ?? 0) retainCount!: number

  static fromJson(json: unknown): BackupScheduleConfigDto {
    return plainToInstance(BackupScheduleConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupScheduleConfig {
    const e = new BackupScheduleConfig()
    e.enabled = this.enabled
    e.cronExpr = this.cronExpr
    e.retainDays = this.retainDays
    e.retainCount = this.retainCount
    return e
  }
}
