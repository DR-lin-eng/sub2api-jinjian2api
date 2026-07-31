import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { DataManagementConfig } from '@/features/admin-backup/domain/models/dataManagementConfig'
import { DataManagementPostgresConfigDto } from '@/features/admin-backup/data/models/dataManagementPostgresConfigDto'
import { DataManagementRedisConfigDto } from '@/features/admin-backup/data/models/dataManagementRedisConfigDto'
import { DataManagementS3ConfigDto } from '@/features/admin-backup/data/models/dataManagementS3ConfigDto'

export class DataManagementConfigDto {
  @Expose({ name: 'source_mode' }) @Transform(({ value }) => value ?? 'direct') sourceMode!: 'direct' | 'docker_exec'
  @Expose({ name: 'backup_root' }) @Transform(({ value }) => value ?? '') backupRoot!: string
  @Expose({ name: 'sqlite_path' }) @Transform(({ value }) => value ?? '') sqlitePath!: string
  @Expose({ name: 'retention_days' }) @Transform(({ value }) => value ?? 0) retentionDays!: number
  @Expose({ name: 'keep_last' }) @Transform(({ value }) => value ?? 0) keepLast!: number
  @Expose({ name: 'active_postgres_profile_id' }) @Transform(({ value }) => value ?? '') activePostgresProfileId!: string
  @Expose({ name: 'active_redis_profile_id' }) @Transform(({ value }) => value ?? '') activeRedisProfileId!: string
  @Expose({ name: 'active_s3_profile_id' }) @Transform(({ value }) => value ?? '') activeS3ProfileId!: string
  @Expose() @Type(() => DataManagementPostgresConfigDto) postgres!: DataManagementPostgresConfigDto
  @Expose() @Type(() => DataManagementRedisConfigDto) redis!: DataManagementRedisConfigDto
  @Expose() @Type(() => DataManagementS3ConfigDto) s3!: DataManagementS3ConfigDto

  static fromJson(json: unknown): DataManagementConfigDto {
    return plainToInstance(DataManagementConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementConfig {
    const e = new DataManagementConfig()
    e.sourceMode = this.sourceMode
    e.backupRoot = this.backupRoot
    e.sqlitePath = this.sqlitePath
    e.retentionDays = this.retentionDays
    e.keepLast = this.keepLast
    e.activePostgresProfileId = this.activePostgresProfileId
    e.activeRedisProfileId = this.activeRedisProfileId
    e.activeS3ProfileId = this.activeS3ProfileId
    e.postgres = this.postgres.toEntity()
    e.redis = this.redis.toEntity()
    e.s3 = this.s3.toEntity()
    return e
  }
}
