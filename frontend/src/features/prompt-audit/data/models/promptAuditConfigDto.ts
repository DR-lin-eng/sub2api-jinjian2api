import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import { PromptAuditEndpointDto } from './promptAuditEndpointDto'

export class PromptAuditConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'blocking_enabled' }) @Transform(({ value }) => value ?? false) blockingEnabled!: boolean
  @Expose({ name: 'store_pass_events' }) @Transform(({ value }) => value ?? false) storePassEvents!: boolean
  @Expose({ name: 'effective_mode' }) @Transform(({ value }) => value ?? 'off') effectiveMode!: string
  @Expose() @Transform(({ value }) => value ?? 'priority') strategy!: 'priority'
  @Expose({ name: 'worker_count' }) @Transform(({ value }) => value ?? 1) workerCount!: number
  @Expose({ name: 'queue_capacity' }) @Transform(({ value }) => value ?? 100) queueCapacity!: number
  @Expose() @Transform(({ value }) => value ?? []) scanners!: string[]
  @Expose({ name: 'all_groups' }) @Transform(({ value }) => value ?? true) allGroups!: boolean
  @Expose({ name: 'group_ids' }) @Transform(({ value }) => value ?? []) groupIds!: number[]
  @Expose() @Type(() => PromptAuditEndpointDto) @Transform(({ value }) => value ?? []) endpoints!: PromptAuditEndpointDto[]
  @Expose({ name: 'config_version' }) @Transform(({ value }) => value ?? 0) configVersion!: number
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'updated_by' }) @Transform(({ value }) => value ?? 0) updatedBy!: number
  @Expose({ name: 'change_summary' }) @Transform(({ value }) => value ?? '') changeSummary!: string

  static fromJson(json: unknown): PromptAuditConfigDto {
    return plainToInstance(PromptAuditConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptAuditConfig {
    const e = new PromptAuditConfig()
    e.enabled = this.enabled
    e.blockingEnabled = this.blockingEnabled
    e.storePassEvents = this.storePassEvents
    e.effectiveMode = this.effectiveMode as PromptAuditConfig['effectiveMode']
    e.strategy = this.strategy
    e.workerCount = this.workerCount
    e.queueCapacity = this.queueCapacity
    e.scanners = this.scanners
    e.allGroups = this.allGroups
    e.groupIds = this.groupIds
    e.endpoints = this.endpoints.map((item) => item.toEntity())
    e.configVersion = this.configVersion
    e.updatedAt = this.updatedAt
    e.updatedBy = this.updatedBy
    e.changeSummary = this.changeSummary
    return e
  }
}
