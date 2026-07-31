import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { MediaStudioItem } from '@/features/media-studio/domain/models/mediaStudioItem'

export class MediaStudioItemDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose({ name: 'media_type' })
  @Transform(({ value }) => value ?? '')
  mediaType!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose({ name: 'thumbnail_url' })
  @Transform(({ value }) => value ?? '')
  thumbnailUrl!: string

  @Expose()
  @Transform(({ value }) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [])
  tags!: string[]

  static fromJson(json: unknown): MediaStudioItemDto {
    return plainToInstance(MediaStudioItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): MediaStudioItem {
    const entity = new MediaStudioItem()
    entity.id = this.id
    entity.name = this.name
    entity.mediaType = this.mediaType
    entity.description = this.description
    entity.thumbnailUrl = this.thumbnailUrl
    entity.tags = [...this.tags]
    return entity
  }
}
