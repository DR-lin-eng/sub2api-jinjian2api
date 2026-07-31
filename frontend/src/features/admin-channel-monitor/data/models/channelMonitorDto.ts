import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { APIMode, BodyOverrideMode, MonitorMode, MonitorStatus, Provider } from '@/core/constants/channelMonitor'
import { ChannelMonitor } from '@/features/admin-channel-monitor/domain/models/channelMonitor'
import { ExtraModelStatusDto } from '@/features/admin-channel-monitor/data/models/extraModelStatusDto'

export class ChannelMonitorDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  provider!: Provider

  @Expose({ name: 'monitor_mode' })
  @Transform(({ value }) => value ?? 'active')
  monitorMode!: MonitorMode

  @Expose({ name: 'channel_id' })
  @Transform(({ value }) => value ?? null)
  channelId!: number | null

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? null)
  groupId!: number | null

  @Expose({ name: 'api_mode' })
  apiMode!: APIMode

  @Expose()
  @Transform(({ value }) => value ?? '')
  endpoint!: string

  @Expose({ name: 'api_key_masked' })
  @Transform(({ value }) => value ?? '')
  apiKeyMasked!: string

  @Expose({ name: 'api_key_decrypt_failed' })
  @Transform(({ value }) => value ?? false)
  apiKeyDecryptFailed!: boolean

  @Expose({ name: 'primary_model' })
  @Transform(({ value }) => value ?? '')
  primaryModel!: string

  @Expose({ name: 'extra_models' })
  @Transform(({ value }) => value ?? [])
  extraModels!: string[]

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  @Expose({ name: 'interval_seconds' })
  @Transform(({ value }) => value ?? 0)
  intervalSeconds!: number

  @Expose({ name: 'jitter_seconds' })
  @Transform(({ value }) => value ?? 0)
  jitterSeconds!: number

  @Expose({ name: 'last_checked_at' })
  @Transform(({ value }) => value ?? null)
  lastCheckedAt!: string | null

  @Expose({ name: 'created_by' })
  @Transform(({ value }) => value ?? 0)
  createdBy!: number

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  @Expose({ name: 'primary_status' })
  @Transform(({ value }) => value ?? '')
  primaryStatus!: MonitorStatus | ''

  @Expose({ name: 'primary_latency_ms' })
  @Transform(({ value }) => value ?? null)
  primaryLatencyMs!: number | null

  @Expose({ name: 'availability_7d' })
  @Transform(({ value }) => value ?? 0)
  availability7d!: number

  @Expose({ name: 'extra_models_status' })
  @Type(() => ExtraModelStatusDto)
  @Transform(({ value }) => value ?? [])
  extraModelsStatus!: ExtraModelStatusDto[]

  @Expose({ name: 'template_id' })
  @Transform(({ value }) => value ?? null)
  templateId!: number | null

  @Expose({ name: 'extra_headers' })
  @Transform(({ value }) => value ?? {})
  extraHeaders!: Record<string, string>

  @Expose({ name: 'body_override_mode' })
  @Transform(({ value }) => value ?? 'off')
  bodyOverrideMode!: BodyOverrideMode

  @Expose({ name: 'body_override' })
  @Transform(({ value }) => value ?? null)
  bodyOverride!: Record<string, unknown> | null

  static fromJson(json: unknown): ChannelMonitorDto {
    return plainToInstance(ChannelMonitorDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ChannelMonitor {
    const e = new ChannelMonitor()
    e.id = this.id
    e.name = this.name
    e.provider = this.provider
    e.monitorMode = this.monitorMode
    e.channelId = this.channelId
    e.groupId = this.groupId
    e.apiMode = this.apiMode
    e.endpoint = this.endpoint
    e.apiKeyMasked = this.apiKeyMasked
    e.apiKeyDecryptFailed = this.apiKeyDecryptFailed
    e.primaryModel = this.primaryModel
    e.extraModels = this.extraModels
    e.groupName = this.groupName
    e.enabled = this.enabled
    e.intervalSeconds = this.intervalSeconds
    e.jitterSeconds = this.jitterSeconds
    e.lastCheckedAt = this.lastCheckedAt
    e.createdBy = this.createdBy
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    e.primaryStatus = this.primaryStatus
    e.primaryLatencyMs = this.primaryLatencyMs
    e.availability7d = this.availability7d
    e.extraModelsStatus = (this.extraModelsStatus ?? []).map(s => s.toEntity())
    e.templateId = this.templateId
    e.extraHeaders = this.extraHeaders
    e.bodyOverrideMode = this.bodyOverrideMode
    e.bodyOverride = this.bodyOverride
    return e
  }
}
