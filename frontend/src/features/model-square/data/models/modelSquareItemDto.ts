import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ModelSquareItem } from '@/features/model-square/domain/models/modelSquareItem'

export class ModelSquareItemDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  @Transform(({ value }) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [])
  tags!: string[]

  static fromJson(json: unknown): ModelSquareItemDto {
    return plainToInstance(ModelSquareItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelSquareItem {
    const entity = new ModelSquareItem()
    entity.id = this.id
    entity.name = this.name
    entity.platform = this.platform
    entity.description = this.description
    entity.tags = [...this.tags]
    return entity
  }
}