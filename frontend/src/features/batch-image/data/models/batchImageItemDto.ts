import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { BatchImageItem, BatchImageItemError } from '@/features/batch-image/domain/models/batchImageItem'

export class BatchImageItemErrorDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  code!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  source!: string

  static fromJson(json: unknown): BatchImageItemErrorDto {
    return plainToInstance(BatchImageItemErrorDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchImageItemError {
    const entity = new BatchImageItemError()
    entity.code = this.code
    entity.message = this.message
    entity.source = this.source
    return entity
  }
}

export class BatchImageItemDto {
  @Expose({ name: 'batch_id' })
  @Transform(({ value }) => value ?? '')
  batchId!: string

  @Expose({ name: 'source_task_name' })
  @Transform(({ value }) => value ?? '')
  sourceTaskName!: string

  @Expose({ name: 'custom_id' })
  @Transform(({ value }) => value ?? '')
  customId!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  status!: string

  @Expose({ name: 'prompt_preview' })
  @Transform(({ value }) => value ?? '')
  promptPreview!: string

  @Expose({ name: 'mime_type' })
  @Transform(({ value }) => value ?? '')
  mimeType!: string

  @Expose({ name: 'file_extension' })
  @Transform(({ value }) => value ?? '')
  fileExtension!: string

  @Expose({ name: 'image_count' })
  @Transform(({ value }) => value ?? 0)
  imageCount!: number

  @Expose()
  @Type(() => BatchImageItemErrorDto)
  error?: BatchImageItemErrorDto

  static fromJson(json: unknown): BatchImageItemDto {
    return plainToInstance(BatchImageItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchImageItem {
    const entity = new BatchImageItem()
    entity.batchId = this.batchId
    entity.sourceTaskName = this.sourceTaskName
    entity.customId = this.customId
    entity.status = this.status
    entity.promptPreview = this.promptPreview
    entity.mimeType = this.mimeType
    entity.fileExtension = this.fileExtension
    entity.imageCount = this.imageCount
    entity.error = this.error ? this.error.toEntity() : undefined
    return entity
  }
}
