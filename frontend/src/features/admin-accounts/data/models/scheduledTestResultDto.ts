import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ScheduledTestResult } from '@/features/admin-accounts/domain/models/scheduledTestResult'

export class ScheduledTestResultDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'plan_id' }) @Transform(({ value }) => value ?? 0) planId!: number
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose({ name: 'response_text' }) @Transform(({ value }) => value ?? '') responseText!: string
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string
  @Expose({ name: 'latency_ms' }) @Transform(({ value }) => value ?? 0) latencyMs!: number
  @Expose({ name: 'started_at' }) @Transform(({ value }) => value ?? '') startedAt!: string
  @Expose({ name: 'finished_at' }) @Transform(({ value }) => value ?? '') finishedAt!: string
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string

  static fromJson(json: unknown): ScheduledTestResultDto {
    return plainToInstance(ScheduledTestResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ScheduledTestResult {
    const e = new ScheduledTestResult()
    e.id = this.id
    e.planId = this.planId
    e.status = this.status
    e.responseText = this.responseText
    e.errorMessage = this.errorMessage
    e.latencyMs = this.latencyMs
    e.startedAt = this.startedAt
    e.finishedAt = this.finishedAt
    e.createdAt = this.createdAt
    return e
  }
}
