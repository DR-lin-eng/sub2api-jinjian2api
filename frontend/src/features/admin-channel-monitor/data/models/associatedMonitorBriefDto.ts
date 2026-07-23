import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { APIMode, Provider } from '@/core/constants/channelMonitor'
import { AssociatedMonitorBrief } from '@/features/admin-channel-monitor/domain/models/associatedMonitorBrief'

export class AssociatedMonitorBriefDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  provider!: Provider

  @Expose({ name: 'api_mode' })
  apiMode!: APIMode

  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  static fromJson(json: unknown): AssociatedMonitorBriefDto {
    return plainToInstance(AssociatedMonitorBriefDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AssociatedMonitorBrief {
    const e = new AssociatedMonitorBrief()
    e.id = this.id
    e.name = this.name
    e.provider = this.provider
    e.apiMode = this.apiMode
    e.enabled = this.enabled
    return e
  }
}
