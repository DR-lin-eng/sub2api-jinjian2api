import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserMonitorView } from '@/features/channel-monitor-user/domain/models/userMonitorView'
import { UserMonitorExtraModelDto } from './userMonitorExtraModelDto'
import { MonitorTimelinePointDto } from './monitorTimelinePointDto'

export class UserMonitorViewDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  provider!: string

  @Expose({ name: 'monitor_mode' })
  @Transform(({ value }) => value ?? '')
  monitorMode!: string

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose({ name: 'primary_model' })
  @Transform(({ value }) => value ?? '')
  primaryModel!: string

  @Expose({ name: 'primary_status' })
  @Transform(({ value }) => value ?? 'unknown')
  primaryStatus!: string

  @Expose({ name: 'primary_latency_ms' })
  @Transform(({ value }) => value ?? 0)
  primaryLatencyMs!: number

  @Expose({ name: 'primary_ping_latency_ms' })
  @Transform(({ value }) => value ?? 0)
  primaryPingLatencyMs!: number

  @Expose({ name: 'availability_7d' })
  @Transform(({ value }) => value ?? 0)
  availability7d!: number

  @Expose({ name: 'extra_models' })
  @Type(() => UserMonitorExtraModelDto)
  extraModels!: UserMonitorExtraModelDto[]

  @Expose()
  @Type(() => MonitorTimelinePointDto)
  timeline!: MonitorTimelinePointDto[]

  static fromJson(json: unknown): UserMonitorViewDto {
    return plainToInstance(UserMonitorViewDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserMonitorView {
    const e = new UserMonitorView()
    e.id = this.id
    e.name = this.name
    e.provider = this.provider as UserMonitorView['provider']
    e.monitorMode = this.monitorMode as UserMonitorView['monitorMode']
    e.groupName = this.groupName
    e.primaryModel = this.primaryModel
    e.primaryStatus = this.primaryStatus as UserMonitorView['primaryStatus']
    e.primaryLatencyMs = this.primaryLatencyMs
    e.primaryPingLatencyMs = this.primaryPingLatencyMs
    e.availability7d = this.availability7d
    e.extraModels = (this.extraModels ?? []).map(d => d.toEntity())
    e.timeline = (this.timeline ?? []).map(d => d.toEntity())
    return e
  }
}
