import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchImageJob } from '@/features/batch-image/domain/models/batchImageJob'

export class BatchImageJobDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  object!: string

  @Expose({ name: 'task_name' })
  @Transform(({ value }) => value ?? '')
  taskName!: string

  @Expose({ name: 'parent_batch_id' })
  @Transform(({ value }) => value ?? '')
  parentBatchId!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  status!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  provider!: string

  @Expose({ name: 'item_count' })
  @Transform(({ value }) => value ?? 0)
  itemCount!: number

  @Expose({ name: 'success_count' })
  @Transform(({ value }) => value ?? 0)
  successCount!: number

  @Expose({ name: 'fail_count' })
  @Transform(({ value }) => value ?? 0)
  failCount!: number

  @Expose({ name: 'estimated_cost' })
  @Transform(({ value }) => value ?? 0)
  estimatedCost!: number

  @Expose({ name: 'hold_amount' })
  @Transform(({ value }) => value ?? 0)
  holdAmount!: number

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => (value === undefined ? null : value))
  actualCostRaw!: number | null

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? 0)
  createdAt!: number

  @Expose({ name: 'submitted_at' })
  @Transform(({ value }) => value ?? 0)
  submittedAt!: number

  @Expose({ name: 'settled_at' })
  @Transform(({ value }) => value ?? 0)
  settledAt!: number

  @Expose({ name: 'downloaded_at' })
  @Transform(({ value }) => value ?? 0)
  downloadedAt!: number

  @Expose({ name: 'output_deleted_at' })
  @Transform(({ value }) => value ?? 0)
  outputDeletedAt!: number

  static fromJson(json: unknown): BatchImageJobDto {
    return plainToInstance(BatchImageJobDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchImageJob {
    const entity = new BatchImageJob()
    entity.id = this.id
    entity.object = this.object
    entity.taskName = this.taskName
    entity.parentBatchId = this.parentBatchId
    entity.status = this.status
    entity.model = this.model
    entity.provider = this.provider
    entity.itemCount = this.itemCount
    entity.successCount = this.successCount
    entity.failCount = this.failCount
    entity.estimatedCost = this.estimatedCost
    entity.holdAmount = this.holdAmount
    entity.actualCost = this.actualCostRaw ?? 0
    entity.costSettled = this.actualCostRaw !== null
    entity.createdAt = this.createdAt
    entity.submittedAt = this.submittedAt
    entity.settledAt = this.settledAt
    entity.downloadedAt = this.downloadedAt
    entity.outputDeletedAt = this.outputDeletedAt
    return entity
  }
}
