import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptProbeResult } from '@/features/prompt-audit/domain/models/promptProbeResult'

export class PromptProbeResultDto {
  @Expose() @Transform(({ value }) => value ?? false) ok!: boolean
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose({ name: 'error_code' }) errorCode?: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string
  @Expose({ name: 'latency_ms' }) @Transform(({ value }) => value ?? 0) latencyMs!: number
  @Expose({ name: 'http_status' }) @Transform(({ value }) => value ?? 0) httpStatus!: number
  @Expose() @Transform(({ value }) => value ?? false) retryable!: boolean
  @Expose({ name: 'checked_at' }) @Transform(({ value }) => value ?? '') checkedAt!: string
  @Expose({ name: 'token_applied' }) @Transform(({ value }) => value ?? false) tokenApplied!: boolean

  static fromJson(json: unknown): PromptProbeResultDto {
    return plainToInstance(PromptProbeResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptProbeResult {
    const e = new PromptProbeResult()
    e.ok = this.ok
    e.status = this.status
    e.errorCode = this.errorCode
    e.message = this.message
    e.latencyMs = this.latencyMs
    e.httpStatus = this.httpStatus
    e.retryable = this.retryable
    e.checkedAt = this.checkedAt
    e.tokenApplied = this.tokenApplied
    return e
  }
}
