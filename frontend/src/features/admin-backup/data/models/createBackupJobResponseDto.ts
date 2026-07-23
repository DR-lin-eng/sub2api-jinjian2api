import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CreateBackupJobResponse } from '@/features/admin-backup/domain/models/createBackupJobResponse'
import type { BackupJobStatus } from '@/features/admin-backup/domain/models/backupJobStatus'

export class CreateBackupJobResponseDto {
  @Expose({ name: 'job_id' }) @Transform(({ value }) => value ?? '') jobId!: string
  @Expose() @Transform(({ value }) => value ?? 'queued') status!: BackupJobStatus

  static fromJson(json: unknown): CreateBackupJobResponseDto {
    return plainToInstance(CreateBackupJobResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CreateBackupJobResponse {
    const e = new CreateBackupJobResponse()
    e.jobId = this.jobId
    e.status = this.status
    return e
  }
}
