import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { BackupJob } from '@/features/admin-backup/domain/models/backupJob'
import { BackupArtifactInfoDto } from '@/features/admin-backup/data/models/backupArtifactInfoDto'
import { BackupS3InfoDto } from '@/features/admin-backup/data/models/backupS3InfoDto'
import type { BackupJobStatus } from '@/features/admin-backup/enums/backupJobStatus'
import type { BackupType } from '@/features/admin-backup/enums/backupType'

export class BackupJobDto {
  @Expose({ name: 'job_id' }) @Transform(({ value }) => value ?? '') jobId!: string
  @Expose({ name: 'backup_type' }) @Transform(({ value }) => value ?? 'full') backupType!: BackupType
  @Expose() @Transform(({ value }) => value ?? 'queued') status!: BackupJobStatus
  @Expose({ name: 'triggered_by' }) @Transform(({ value }) => value ?? '') triggeredBy!: string
  @Expose({ name: 's3_profile_id' }) @Transform(({ value }) => value ?? '') s3ProfileId!: string
  @Expose({ name: 'postgres_profile_id' }) @Transform(({ value }) => value ?? '') postgresProfileId!: string
  @Expose({ name: 'redis_profile_id' }) @Transform(({ value }) => value ?? '') redisProfileId!: string
  @Expose({ name: 'started_at' }) @Transform(({ value }) => value ?? '') startedAt!: string
  @Expose({ name: 'finished_at' }) @Transform(({ value }) => value ?? '') finishedAt!: string
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string
  @Expose() @Type(() => BackupArtifactInfoDto) artifact?: BackupArtifactInfoDto
  @Expose() @Type(() => BackupS3InfoDto) s3?: BackupS3InfoDto

  static fromJson(json: unknown): BackupJobDto {
    return plainToInstance(BackupJobDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BackupJob {
    const e = new BackupJob()
    e.jobId = this.jobId
    e.backupType = this.backupType
    e.status = this.status
    e.triggeredBy = this.triggeredBy
    e.s3ProfileId = this.s3ProfileId
    e.postgresProfileId = this.postgresProfileId
    e.redisProfileId = this.redisProfileId
    e.startedAt = this.startedAt
    e.finishedAt = this.finishedAt
    e.errorMessage = this.errorMessage
    e.artifact = this.artifact ? this.artifact.toEntity() : undefined
    e.s3 = this.s3 ? this.s3.toEntity() : undefined
    return e
  }
}
