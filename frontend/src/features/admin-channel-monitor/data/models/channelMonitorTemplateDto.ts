import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { APIMode, BodyOverrideMode, Provider } from '@/core/constants/channelMonitor'
import { ChannelMonitorTemplate } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplate'

export class ChannelMonitorTemplateDto {
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
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose({ name: 'extra_headers' })
  @Transform(({ value }) => value ?? {})
  extraHeaders!: Record<string, string>

  @Expose({ name: 'body_override_mode' })
  @Transform(({ value }) => value ?? 'off')
  bodyOverrideMode!: BodyOverrideMode

  @Expose({ name: 'body_override' })
  @Transform(({ value }) => value ?? null)
  bodyOverride!: Record<string, unknown> | null

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  @Expose({ name: 'associated_monitors' })
  @Transform(({ value }) => value ?? 0)
  associatedMonitors!: number

  static fromJson(json: unknown): ChannelMonitorTemplateDto {
    return plainToInstance(ChannelMonitorTemplateDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ChannelMonitorTemplate {
    const e = new ChannelMonitorTemplate()
    e.id = this.id
    e.name = this.name
    e.provider = this.provider
    e.apiMode = this.apiMode
    e.description = this.description
    e.extraHeaders = this.extraHeaders
    e.bodyOverrideMode = this.bodyOverrideMode
    e.bodyOverride = this.bodyOverride
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    e.associatedMonitors = this.associatedMonitors
    return e
  }
}
