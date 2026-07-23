import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BackupRecord } from '@/features/admin-backup/domain/models/backupRecord'
import type { BackupStatus } from '@/features/admin-backup/domain/models/backupRecord'

export class BackupRecordDto {
  @Expose() @Transform(({ value }) => value ?? '') id!: string
  @Expose() @Transform(({ value }) => value ?? 'pending') status!: BackupStatus
  @Expose({ name: 'backup_type' }) @Transform(({ value }) => value ?? '') backupType!: string
  @Expose({ name: 'file_name' }) @Transform(({ value }) => value ?? '') fileName!: string
  @Expose({ name: 's3_key' }) @Transform(({ value }) => value ?? '') s3Key!: string
  @Expose({ name: 'size_bytes' }) @Transform(({ value }) => value ?? 0) sizeBytes!: number
  @Expose({ name: 'triggered_by' }) @Transform(({ value }) => value ?? '') triggeredBy!: string
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string
  @Expose({ name: 'started_at' }) @Transform(({ value }) => value ?? '') startedAt!: string
  @Expose({ name: 'finished_at' }) @Transform(({ value }) => value ?? '') finishedAt!: string
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? '') expiresAt!: string
  @Expose() @Transform(({ value }) => value ?? '') progress!: string
  @Expose({ name: 'restore_status' }) @Transform(({ value }) => value ?? '') restoreStatus!: string
  @Expose({ name: 'restore_error' }) @Transform(({ value }) => value ?? '') restoreError!: string
  @Expose({ name: 'restored_at' }) @Transform(({ value }) => value ?? '') restoredAt!: string

  static fromJson(json: unknown): BackupRecordDto {
    return plainToInstance(BackupRecordDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupRecord {
    const e = new BackupRecord()
    e.id = this.id
    e.status = this.status
    e.backupType = this.backupType
    e.fileName = this.fileName
    e.s3Key = this.s3Key
    e.sizeBytes = this.sizeBytes
    e.triggeredBy = this.triggeredBy
    e.errorMessage = this.errorMessage
    e.startedAt = this.startedAt
    e.finishedAt = this.finishedAt
    e.expiresAt = this.expiresAt
    e.progress = this.progress
    e.restoreStatus = this.restoreStatus
    e.restoreError = this.restoreError
    e.restoredAt = this.restoredAt
    return e
  }
}
