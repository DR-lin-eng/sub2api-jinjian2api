import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptDeleteResult } from '@/features/prompt-audit/domain/models/promptDeleteResult'

export class PromptDeleteResultDto {
  @Expose({ name: 'deleted_events' }) @Transform(({ value }) => value ?? 0) deletedEvents!: number
  @Expose({ name: 'deleted_jobs' }) @Transform(({ value }) => value ?? 0) deletedJobs!: number

  static fromJson(json: unknown): PromptDeleteResultDto {
    return plainToInstance(PromptDeleteResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptDeleteResult {
    const e = new PromptDeleteResult()
    e.deletedEvents = this.deletedEvents
    e.deletedJobs = this.deletedJobs
    return e
  }
}
