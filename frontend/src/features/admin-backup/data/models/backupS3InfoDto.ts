import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BackupS3Info } from '@/features/admin-backup/domain/models/backupS3Info'

export class BackupS3InfoDto {
  @Expose() @Transform(({ value }) => value ?? '') bucket!: string
  @Expose() @Transform(({ value }) => value ?? '') key!: string
  @Expose() @Transform(({ value }) => value ?? '') etag!: string

  static fromJson(json: unknown): BackupS3InfoDto {
    return plainToInstance(BackupS3InfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupS3Info {
    const e = new BackupS3Info()
    e.bucket = this.bucket
    e.key = this.key
    e.etag = this.etag
    return e
  }
}
