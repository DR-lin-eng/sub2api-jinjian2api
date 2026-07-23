import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { MonitorStatus } from '@/core/constants/channelMonitor'
import { ExtraModelStatus } from '@/features/admin-channel-monitor/domain/models/extraModelStatus'

export class ExtraModelStatusDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

  @Expose()
  status!: MonitorStatus | ''

  @Expose({ name: 'latency_ms' })
  @Transform(({ value }) => value ?? null)
  latencyMs!: number | null

  static fromJson(json: unknown): ExtraModelStatusDto {
    return plainToInstance(ExtraModelStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ExtraModelStatus {
    const e = new ExtraModelStatus()
    e.model = this.model
    e.status = this.status ?? ''
    e.latencyMs = this.latencyMs
    return e
  }
}
