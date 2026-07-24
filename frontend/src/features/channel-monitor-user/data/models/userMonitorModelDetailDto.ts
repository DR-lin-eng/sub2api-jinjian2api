import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserMonitorModelDetail } from '@/features/channel-monitor-user/domain/models/userMonitorModelDetail'

export class UserMonitorModelDetailDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

  @Expose({ name: 'latest_status' })
  @Transform(({ value }) => value ?? 'unknown')
  latestStatus!: string

  @Expose({ name: 'latest_latency_ms' })
  @Transform(({ value }) => value ?? 0)
  latestLatencyMs!: number

  @Expose({ name: 'availability_7d' })
  @Transform(({ value }) => value ?? 0)
  availability7d!: number

  @Expose({ name: 'availability_15d' })
  @Transform(({ value }) => value ?? 0)
  availability15d!: number

  @Expose({ name: 'availability_30d' })
  @Transform(({ value }) => value ?? 0)
  availability30d!: number

  @Expose({ name: 'avg_latency_7d_ms' })
  @Transform(({ value }) => value ?? 0)
  avgLatency7dMs!: number

  static fromJson(json: unknown): UserMonitorModelDetailDto {
    return plainToInstance(UserMonitorModelDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserMonitorModelDetail {
    const e = new UserMonitorModelDetail()
    e.model = this.model
    e.latestStatus = this.latestStatus as UserMonitorModelDetail['latestStatus']
    e.latestLatencyMs = this.latestLatencyMs
    e.availability7d = this.availability7d
    e.availability15d = this.availability15d
    e.availability30d = this.availability30d
    e.avgLatency7dMs = this.avgLatency7dMs
    return e
  }
}
