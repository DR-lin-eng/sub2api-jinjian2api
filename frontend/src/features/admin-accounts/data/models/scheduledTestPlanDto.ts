import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ScheduledTestPlan } from '@/features/admin-accounts/domain/models/scheduledTestPlan'

export class ScheduledTestPlanDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose({ name: 'model_id' }) @Transform(({ value }) => value ?? '') modelId!: string
  @Expose({ name: 'cron_expression' }) @Transform(({ value }) => value ?? '') cronExpression!: string
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'max_results' }) @Transform(({ value }) => value ?? 10) maxResults!: number
  @Expose({ name: 'auto_recover' }) @Transform(({ value }) => value ?? false) autoRecover!: boolean
  @Expose({ name: 'last_run_at' }) @Transform(({ value }) => value ?? '') lastRunAt!: string
  @Expose({ name: 'next_run_at' }) @Transform(({ value }) => value ?? '') nextRunAt!: string
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): ScheduledTestPlanDto {
    return plainToInstance(ScheduledTestPlanDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ScheduledTestPlan {
    const e = new ScheduledTestPlan()
    e.id = this.id
    e.accountId = this.accountId
    e.modelId = this.modelId
    e.cronExpression = this.cronExpression
    e.enabled = this.enabled
    e.maxResults = this.maxResults
    e.autoRecover = this.autoRecover
    e.lastRunAt = this.lastRunAt
    e.nextRunAt = this.nextRunAt
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    return e
  }
}
