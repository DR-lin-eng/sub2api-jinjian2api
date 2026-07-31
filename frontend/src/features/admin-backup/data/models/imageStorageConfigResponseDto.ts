import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ImageStorageConfigResponse } from '@/features/admin-backup/domain/models/imageStorageConfigResponse'
import { ImageStorageConfigDto } from '@/features/admin-backup/data/models/imageStorageConfigDto'

export class ImageStorageConfigResponseDto {
  @Expose()
  @Type(() => ImageStorageConfigDto)
  config!: ImageStorageConfigDto

  @Expose({ name: 'secret_configured' }) @Transform(({ value }) => value ?? false) secretConfigured!: boolean

  static fromJson(json: unknown): ImageStorageConfigResponseDto {
    return plainToInstance(ImageStorageConfigResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ImageStorageConfigResponse {
    const e = new ImageStorageConfigResponse()
    e.config = this.config.toEntity()
    e.secretConfigured = this.secretConfigured
    return e
  }
}
