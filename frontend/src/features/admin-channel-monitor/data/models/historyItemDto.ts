import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { MonitorStatus } from '@/core/constants/channelMonitor'
import { HistoryItem } from '@/features/admin-channel-monitor/domain/models/historyItem'

export class HistoryItemDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

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

  static fromJson(json: unknown): HistoryItemDto {
    return plainToInstance(HistoryItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): HistoryItem {
    const e = new HistoryItem()
    e.id = this.id
    e.model = this.model
    e.status = this.status
    e.latencyMs = this.latencyMs
    e.pingLatencyMs = this.pingLatencyMs
    e.message = this.message
    e.checkedAt = this.checkedAt
    return e
  }
}
