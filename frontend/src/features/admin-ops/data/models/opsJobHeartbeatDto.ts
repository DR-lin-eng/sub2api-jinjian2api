import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsJobHeartbeat } from '@/features/admin-ops/domain/models/opsJobHeartbeat'

export class OpsJobHeartbeatDto {
  @Expose({ name: 'job_name' }) @Transform(({ value }) => value ?? '') jobName!: string
  @Expose({ name: 'last_run_at' }) @Transform(({ value }) => value ?? '') lastRunAt!: string
  @Expose({ name: 'last_success_at' }) @Transform(({ value }) => value ?? '') lastSuccessAt!: string
  @Expose({ name: 'last_error_at' }) @Transform(({ value }) => value ?? '') lastErrorAt!: string
  @Expose({ name: 'last_error' }) @Transform(({ value }) => value ?? '') lastError!: string
  @Expose({ name: 'last_duration_ms' }) @Transform(({ value }) => value ?? 0) lastDurationMs!: number
  @Expose({ name: 'last_result' }) @Transform(({ value }) => value ?? '') lastResult!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): OpsJobHeartbeatDto {
    return plainToInstance(OpsJobHeartbeatDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsJobHeartbeat {
    const e = new OpsJobHeartbeat()
    e.jobName = this.jobName
    e.lastRunAt = this.lastRunAt
    e.lastSuccessAt = this.lastSuccessAt
    e.lastErrorAt = this.lastErrorAt
    e.lastError = this.lastError
    e.lastDurationMs = this.lastDurationMs
    e.lastResult = this.lastResult
    e.updatedAt = this.updatedAt
    return e
  }
}
