import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DataManagementS3Config } from '@/features/admin-backup/domain/models/dataManagementS3Config'

export class DataManagementS3ConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? '') endpoint!: string
  @Expose() @Transform(({ value }) => value ?? '') region!: string
  @Expose() @Transform(({ value }) => value ?? '') bucket!: string
  @Expose({ name: 'access_key_id' }) @Transform(({ value }) => value ?? '') accessKeyId!: string
  @Expose({ name: 'secret_access_key' }) @Transform(({ value }) => value ?? '') secretAccessKey!: string
  @Expose({ name: 'secret_access_key_configured' }) @Transform(({ value }) => value ?? false) secretAccessKeyConfigured!: boolean
  @Expose() @Transform(({ value }) => value ?? '') prefix!: string
  @Expose({ name: 'force_path_style' }) @Transform(({ value }) => value ?? false) forcePathStyle!: boolean
  @Expose({ name: 'use_ssl' }) @Transform(({ value }) => value ?? false) useSsl!: boolean

  static fromJson(json: unknown): DataManagementS3ConfigDto {
    return plainToInstance(DataManagementS3ConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementS3Config {
    const e = new DataManagementS3Config()
    e.enabled = this.enabled
    e.endpoint = this.endpoint
    e.region = this.region
    e.bucket = this.bucket
    e.accessKeyId = this.accessKeyId
    e.secretAccessKey = this.secretAccessKey
    e.secretAccessKeyConfigured = this.secretAccessKeyConfigured
    e.prefix = this.prefix
    e.forcePathStyle = this.forcePathStyle
    e.useSsl = this.useSsl
    return e
  }
}
