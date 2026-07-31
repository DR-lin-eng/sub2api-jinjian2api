import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ListBackupJobsResponse } from '@/features/admin-backup/domain/models/listBackupJobsResponse'
import { BackupJobDto } from '@/features/admin-backup/data/models/backupJobDto'

export class ListBackupJobsResponseDto {
  @Expose() @Type(() => BackupJobDto) @Transform(({ value }) => value ?? []) items!: BackupJobDto[]
  @Expose({ name: 'next_page_token' }) @Transform(({ value }) => value ?? '') nextPageToken!: string

  static fromJson(json: unknown): ListBackupJobsResponseDto {
    return plainToInstance(ListBackupJobsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ListBackupJobsResponse {
    const e = new ListBackupJobsResponse()
    e.items = this.items.map(i => i.toEntity())
    e.nextPageToken = this.nextPageToken
    return e
  }
}
