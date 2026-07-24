import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsSystemLogSinkHealth } from '@/features/admin-ops/domain/models/opsSystemLogSinkHealth'

export class OpsSystemLogSinkHealthDto {
  @Expose({ name: 'queue_depth' }) @Transform(({ value }) => value ?? 0) queueDepth!: number
  @Expose({ name: 'queue_capacity' }) @Transform(({ value }) => value ?? 0) queueCapacity!: number
  @Expose({ name: 'dropped_count' }) @Transform(({ value }) => value ?? 0) droppedCount!: number
  @Expose({ name: 'write_failed_count' }) @Transform(({ value }) => value ?? 0) writeFailedCount!: number
  @Expose({ name: 'written_count' }) @Transform(({ value }) => value ?? 0) writtenCount!: number
  @Expose({ name: 'avg_write_delay_ms' }) @Transform(({ value }) => value ?? 0) avgWriteDelayMs!: number
  @Expose({ name: 'last_error' }) @Transform(({ value }) => value ?? '') lastError!: string

  static fromJson(json: unknown): OpsSystemLogSinkHealthDto {
    return plainToInstance(OpsSystemLogSinkHealthDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsSystemLogSinkHealth {
    const e = new OpsSystemLogSinkHealth()
    e.queueDepth = this.queueDepth
    e.queueCapacity = this.queueCapacity
    e.droppedCount = this.droppedCount
    e.writeFailedCount = this.writeFailedCount
    e.writtenCount = this.writtenCount
    e.avgWriteDelayMs = this.avgWriteDelayMs
    e.lastError = this.lastError
    return e
  }
}
