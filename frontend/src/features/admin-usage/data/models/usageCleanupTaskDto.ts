import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UsageCleanupTask } from '@/features/admin-usage/domain/models/usageCleanupTask'

export class UsageCleanupTaskDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose({ name: 'created_by' }) @Transform(({ value }) => value ?? 0) createdBy!: number
  @Expose({ name: 'deleted_rows' }) @Transform(({ value }) => value ?? 0) deletedRows!: number
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string
  @Expose({ name: 'canceled_by' }) @Transform(({ value }) => value ?? 0) canceledBy!: number
  @Expose({ name: 'canceled_at' }) @Transform(({ value }) => value ?? '') canceledAt!: string
  @Expose({ name: 'started_at' }) @Transform(({ value }) => value ?? '') startedAt!: string
  @Expose({ name: 'finished_at' }) @Transform(({ value }) => value ?? '') finishedAt!: string
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): UsageCleanupTaskDto {
    return plainToInstance(UsageCleanupTaskDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UsageCleanupTask {
    const e = new UsageCleanupTask()
    e.id = this.id
    e.status = this.status
    e.createdBy = this.createdBy
    e.deletedRows = this.deletedRows
    e.errorMessage = this.errorMessage
    e.canceledBy = this.canceledBy
    e.canceledAt = this.canceledAt
    e.startedAt = this.startedAt
    e.finishedAt = this.finishedAt
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    return e
  }
}
