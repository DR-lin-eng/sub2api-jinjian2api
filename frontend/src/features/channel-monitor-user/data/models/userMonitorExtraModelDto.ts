import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserMonitorExtraModel } from '@/features/channel-monitor-user/domain/models/userMonitorExtraModel'

export class UserMonitorExtraModelDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

  @Expose()
  @Transform(({ value }) => value ?? 'unknown')
  status!: string

  @Expose({ name: 'latency_ms' })
  @Transform(({ value }) => value ?? 0)
  latencyMs!: number

  static fromJson(json: unknown): UserMonitorExtraModelDto {
    return plainToInstance(UserMonitorExtraModelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserMonitorExtraModel {
    const e = new UserMonitorExtraModel()
    e.model = this.model
    e.status = this.status as UserMonitorExtraModel['status']
    e.latencyMs = this.latencyMs
    return e
  }
}
