import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsRuntimeLogConfig } from '@/features/admin-ops/domain/models/opsRuntimeLogConfig'

export class OpsRuntimeLogConfigDto {
  @Expose() @Transform(({ value }) => value ?? 'info') level!: OpsRuntimeLogConfig['level']
  @Expose({ name: 'enable_sampling' }) @Transform(({ value }) => value ?? false) enableSampling!: boolean
  @Expose({ name: 'sampling_initial' }) @Transform(({ value }) => value ?? 0) samplingInitial!: number
  @Expose({ name: 'sampling_thereafter' }) @Transform(({ value }) => value ?? 0) samplingThereafter!: number
  @Expose() @Transform(({ value }) => value ?? false) caller!: boolean
  @Expose({ name: 'stacktrace_level' }) @Transform(({ value }) => value ?? 'none') stacktraceLevel!: OpsRuntimeLogConfig['stacktraceLevel']
  @Expose({ name: 'retention_days' }) @Transform(({ value }) => value ?? 0) retentionDays!: number
  @Expose({ name: 'redis_only' }) @Transform(({ value }) => value ?? false) redisOnly!: boolean
  @Expose() @Transform(({ value }) => value ?? '') source!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'updated_by_user_id' }) @Transform(({ value }) => value ?? 0) updatedByUserId!: number

  static fromJson(json: unknown): OpsRuntimeLogConfigDto {
    return plainToInstance(OpsRuntimeLogConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsRuntimeLogConfig {
    const e = new OpsRuntimeLogConfig()
    e.level = this.level
    e.enableSampling = this.enableSampling
    e.samplingInitial = this.samplingInitial
    e.samplingThereafter = this.samplingThereafter
    e.caller = this.caller
    e.stacktraceLevel = this.stacktraceLevel
    e.retentionDays = this.retentionDays
    e.redisOnly = this.redisOnly
    e.source = this.source
    e.updatedAt = this.updatedAt
    e.updatedByUserId = this.updatedByUserId
    return e
  }
}
