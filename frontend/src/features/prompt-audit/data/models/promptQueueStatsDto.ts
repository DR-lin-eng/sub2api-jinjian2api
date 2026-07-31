import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptQueueStats } from '@/features/prompt-audit/domain/models/promptQueueStats'

export class PromptQueueStatsDto {
  @Expose() @Transform(({ value }) => value ?? 0) staging!: number
  @Expose() @Transform(({ value }) => value ?? 0) queued!: number
  @Expose() @Transform(({ value }) => value ?? 0) processing!: number
  @Expose() @Transform(({ value }) => value ?? 0) retry!: number
  @Expose() @Transform(({ value }) => value ?? 0) done!: number
  @Expose() @Transform(({ value }) => value ?? 0) failed!: number
  @Expose() @Transform(({ value }) => value ?? 0) active!: number

  static fromJson(json: unknown): PromptQueueStatsDto {
    return plainToInstance(PromptQueueStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptQueueStats {
    const e = new PromptQueueStats()
    e.staging = this.staging
    e.queued = this.queued
    e.processing = this.processing
    e.retry = this.retry
    e.done = this.done
    e.failed = this.failed
    e.active = this.active
    return e
  }
}
