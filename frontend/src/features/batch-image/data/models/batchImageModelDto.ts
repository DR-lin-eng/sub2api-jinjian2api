import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchImageModel } from '@/features/batch-image/domain/models/batchImageModel'

export class BatchImageModelDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  object!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  provider!: string

  static fromJson(json: unknown): BatchImageModelDto {
    return plainToInstance(BatchImageModelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchImageModel {
    const entity = new BatchImageModel()
    entity.id = this.id
    entity.object = this.object
    entity.provider = this.provider
    return entity
  }
}
