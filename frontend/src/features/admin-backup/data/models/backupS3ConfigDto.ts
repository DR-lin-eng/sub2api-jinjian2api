import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BackupS3Config } from '@/features/admin-backup/domain/models/backupS3Config'

export class BackupS3ConfigDto {
  @Expose() @Transform(({ value }) => value ?? '') endpoint!: string
  @Expose() @Transform(({ value }) => value ?? '') region!: string
  @Expose() @Transform(({ value }) => value ?? '') bucket!: string
  @Expose({ name: 'access_key_id' }) @Transform(({ value }) => value ?? '') accessKeyId!: string
  @Expose({ name: 'secret_access_key' }) @Transform(({ value }) => value ?? '') secretAccessKey!: string
  @Expose() @Transform(({ value }) => value ?? '') prefix!: string
  @Expose({ name: 'force_path_style' }) @Transform(({ value }) => value ?? false) forcePathStyle!: boolean

  static fromJson(json: unknown): BackupS3ConfigDto {
    return plainToInstance(BackupS3ConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupS3Config {
    const e = new BackupS3Config()
    e.endpoint = this.endpoint
    e.region = this.region
    e.bucket = this.bucket
    e.accessKeyId = this.accessKeyId
    e.secretAccessKey = this.secretAccessKey
    e.prefix = this.prefix
    e.forcePathStyle = this.forcePathStyle
    return e
  }
}
