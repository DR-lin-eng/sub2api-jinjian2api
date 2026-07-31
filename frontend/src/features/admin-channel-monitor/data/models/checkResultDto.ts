import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { MonitorStatus } from '@/core/constants/channelMonitor'
import { CheckResult } from '@/features/admin-channel-monitor/domain/models/checkResult'

export class CheckResultDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

  @Expose()
  status!: MonitorStatus

  @Expose({ name: 'latency_ms' })
  @Transform(({ value }) => value ?? null)
  latencyMs!: number | null

  @Expose({ name: 'ping_latency_ms' })
  @Transform(({ value }) => value ?? null)
  pingLatencyMs!: number | null

  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  @Expose({ name: 'checked_at' })
  @Transform(({ value }) => value ?? '')
  checkedAt!: string

  static fromJson(json: unknown): CheckResultDto {
    return plainToInstance(CheckResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CheckResult {
    const e = new CheckResult()
    e.model = this.model
    e.status = this.status
    e.latencyMs = this.latencyMs
    e.pingLatencyMs = this.pingLatencyMs
    e.message = this.message
    e.checkedAt = this.checkedAt
    return e
  }
}
