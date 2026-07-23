import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ImageStorageConfig } from '@/features/admin-backup/domain/models/imageStorageConfig'

export class ImageStorageConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'reuse_backup_s3' }) @Transform(({ value }) => value ?? false) reuseBackupS3!: boolean
  @Expose() @Transform(({ value }) => value ?? '') bucket!: string
  @Expose() @Transform(({ value }) => value ?? '') prefix!: string
  @Expose({ name: 'public_base_url' }) @Transform(({ value }) => value ?? '') publicBaseUrl!: string
  @Expose({ name: 'presign_expiry_hours' }) @Transform(({ value }) => value ?? 0) presignExpiryHours!: number
  @Expose({ name: 'max_download_bytes' }) @Transform(({ value }) => value ?? 0) maxDownloadBytes!: number
  @Expose() @Transform(({ value }) => value ?? '') endpoint!: string
  @Expose() @Transform(({ value }) => value ?? '') region!: string
  @Expose({ name: 'access_key_id' }) @Transform(({ value }) => value ?? '') accessKeyId!: string
  @Expose({ name: 'secret_access_key' }) @Transform(({ value }) => value ?? '') secretAccessKey!: string
  @Expose({ name: 'force_path_style' }) @Transform(({ value }) => value ?? false) forcePathStyle!: boolean

  static fromJson(json: unknown): ImageStorageConfigDto {
    return plainToInstance(ImageStorageConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ImageStorageConfig {
    const e = new ImageStorageConfig()
    e.enabled = this.enabled
    e.reuseBackupS3 = this.reuseBackupS3
    e.bucket = this.bucket
    e.prefix = this.prefix
    e.publicBaseUrl = this.publicBaseUrl
    e.presignExpiryHours = this.presignExpiryHours
    e.maxDownloadBytes = this.maxDownloadBytes
    e.endpoint = this.endpoint
    e.region = this.region
    e.accessKeyId = this.accessKeyId
    e.secretAccessKey = this.secretAccessKey
    e.forcePathStyle = this.forcePathStyle
    return e
  }
}
