import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { PromptAuditRuntime } from '@/features/prompt-audit/domain/models/promptAuditRuntime'
import { PromptQueueStatsDto } from './promptQueueStatsDto'
import { PromptGuardMetricsDto } from './promptGuardMetricsDto'
import { PromptProbeResultDto } from './promptProbeResultDto'

export class PromptAuditRuntimeDto {
  @Expose({ name: 'process_status' }) @Transform(({ value }) => value ?? 'disabled') processStatus!: string
  @Expose({ name: 'effective_mode' }) @Transform(({ value }) => value ?? 'off') effectiveMode!: string
  @Expose({ name: 'expected_config_version' }) @Transform(({ value }) => value ?? 0) expectedConfigVersion!: number
  @Expose({ name: 'active_config_version' }) @Transform(({ value }) => value ?? 0) activeConfigVersion!: number
  @Expose({ name: 'config_loaded_at' }) configLoadedAt?: string
  @Expose({ name: 'config_load_error' }) configLoadError?: string
  @Expose({ name: 'worker_total' }) @Transform(({ value }) => value ?? 0) workerTotal!: number
  @Expose({ name: 'worker_active' }) @Transform(({ value }) => value ?? 0) workerActive!: number
  @Expose({ name: 'worker_heartbeat_at' }) workerHeartbeatAt?: string
  @Expose({ name: 'queue_capacity' }) @Transform(({ value }) => value ?? 0) queueCapacity!: number
  @Expose() @Type(() => PromptQueueStatsDto) queue!: PromptQueueStatsDto
  @Expose({ name: 'processed_total' }) @Transform(({ value }) => value ?? 0) processedTotal!: number
  @Expose({ name: 'failed_total' }) @Transform(({ value }) => value ?? 0) failedTotal!: number
  @Expose({ name: 'enqueued_total' }) @Transform(({ value }) => value ?? 0) enqueuedTotal!: number
  @Expose({ name: 'dropped_total' }) @Transform(({ value }) => value ?? 0) droppedTotal!: number
  @Expose({ name: 'last_processed_at' }) lastProcessedAt?: string
  @Expose({ name: 'last_error_code' }) lastErrorCode?: string
  @Expose({ name: 'last_error_message' }) lastErrorMessage?: string
  @Expose({ name: 'database_status' }) @Transform(({ value }) => value ?? '') databaseStatus!: string
  @Expose({ name: 'redis_status' }) @Transform(({ value }) => value ?? '') redisStatus!: string
  @Expose() @Transform(({ value }) => value ?? {}) endpoints!: Record<string, unknown>
  @Expose({ name: 'guard_metrics' }) @Type(() => PromptGuardMetricsDto) guardMetrics!: PromptGuardMetricsDto

  static fromJson(json: unknown): PromptAuditRuntimeDto {
    return plainToInstance(PromptAuditRuntimeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptAuditRuntime {
    const e = new PromptAuditRuntime()
    e.processStatus = this.processStatus
    e.effectiveMode = this.effectiveMode as PromptAuditRuntime['effectiveMode']
    e.expectedConfigVersion = this.expectedConfigVersion
    e.activeConfigVersion = this.activeConfigVersion
    e.configLoadedAt = this.configLoadedAt
    e.configLoadError = this.configLoadError
    e.workerTotal = this.workerTotal
    e.workerActive = this.workerActive
    e.workerHeartbeatAt = this.workerHeartbeatAt
    e.queueCapacity = this.queueCapacity
    e.queue = this.queue ? this.queue.toEntity() : PromptQueueStatsDto.fromJson({}).toEntity()
    e.processedTotal = this.processedTotal
    e.failedTotal = this.failedTotal
    e.enqueuedTotal = this.enqueuedTotal
    e.droppedTotal = this.droppedTotal
    e.lastProcessedAt = this.lastProcessedAt
    e.lastErrorCode = this.lastErrorCode
    e.lastErrorMessage = this.lastErrorMessage
    e.databaseStatus = this.databaseStatus
    e.redisStatus = this.redisStatus
    e.endpoints = Object.fromEntries(
      Object.entries(this.endpoints).map(([k, v]) => [k, PromptProbeResultDto.fromJson(v).toEntity()])
    )
    e.guardMetrics = this.guardMetrics ? this.guardMetrics.toEntity() : PromptGuardMetricsDto.fromJson({}).toEntity()
    return e
  }
}
