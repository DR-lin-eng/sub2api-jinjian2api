import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { MonitorTimelinePoint } from '@/features/channel-monitor-user/domain/models/monitorTimelinePoint'

export class MonitorTimelinePointDto {
  @Expose()
  @Transform(({ value }) => value ?? 'unknown')
  status!: string

  @Expose({ name: 'latency_ms' })
  @Transform(({ value }) => value ?? 0)
  latencyMs!: number

  @Expose({ name: 'ping_latency_ms' })
  @Transform(({ value }) => value ?? 0)
  pingLatencyMs!: number

  @Expose({ name: 'checked_at' })
  @Transform(({ value }) => value ?? '')
  checkedAt!: string

  static fromJson(json: unknown): MonitorTimelinePointDto {
    return plainToInstance(MonitorTimelinePointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): MonitorTimelinePoint {
    const e = new MonitorTimelinePoint()
    e.status = this.status as MonitorTimelinePoint['status']
    e.latencyMs = this.latencyMs
    e.pingLatencyMs = this.pingLatencyMs
    e.checkedAt = this.checkedAt
    return e
  }
}
