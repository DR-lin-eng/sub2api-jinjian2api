import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptGuardMetrics } from '@/features/prompt-audit/domain/models/promptGuardMetrics'

export class PromptGuardMetricsDto {
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Transform(({ value }) => value ?? 0) allowed!: number
  @Expose() @Transform(({ value }) => value ?? 0) flagged!: number
  @Expose() @Transform(({ value }) => value ?? 0) blocked!: number
  @Expose() @Transform(({ value }) => value ?? 0) unavailable!: number
  @Expose() @Transform(({ value }) => value ?? 0) invalid!: number
  @Expose() @Transform(({ value }) => value ?? 0) timeouts!: number
  @Expose() @Transform(({ value }) => value ?? 0) failovers!: number
  @Expose({ name: 'bulkhead_full' }) @Transform(({ value }) => value ?? 0) bulkheadFull!: number
  @Expose({ name: 'record_failed' }) @Transform(({ value }) => value ?? 0) recordFailed!: number
  @Expose({ name: 'latency_avg_ms' }) latencyAvgMs?: number
  @Expose({ name: 'latency_p50_ms' }) latencyP50Ms?: number
  @Expose({ name: 'latency_p95_ms' }) latencyP95Ms?: number
  @Expose({ name: 'latency_p99_ms' }) latencyP99Ms?: number
  @Expose({ name: 'latency_max_ms' }) latencyMaxMs?: number

  static fromJson(json: unknown): PromptGuardMetricsDto {
    return plainToInstance(PromptGuardMetricsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptGuardMetrics {
    const e = new PromptGuardMetrics()
    e.total = this.total
    e.allowed = this.allowed
    e.flagged = this.flagged
    e.blocked = this.blocked
    e.unavailable = this.unavailable
    e.invalid = this.invalid
    e.timeouts = this.timeouts
    e.failovers = this.failovers
    e.bulkheadFull = this.bulkheadFull
    e.recordFailed = this.recordFailed
    e.latencyAvgMs = this.latencyAvgMs
    e.latencyP50Ms = this.latencyP50Ms
    e.latencyP95Ms = this.latencyP95Ms
    e.latencyP99Ms = this.latencyP99Ms
    e.latencyMaxMs = this.latencyMaxMs
    return e
  }
}
