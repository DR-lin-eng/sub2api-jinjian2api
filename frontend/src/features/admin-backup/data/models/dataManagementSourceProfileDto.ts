import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { DataManagementSourceProfile } from '@/features/admin-backup/domain/models/dataManagementSourceProfile'
import { DataManagementSourceConfigDto } from '@/features/admin-backup/data/models/dataManagementSourceConfigDto'
import type { SourceType } from '@/features/admin-backup/domain/models/sourceType'

export class DataManagementSourceProfileDto {
  @Expose({ name: 'source_type' }) @Transform(({ value }) => value ?? 'postgres') sourceType!: SourceType
  @Expose({ name: 'profile_id' }) @Transform(({ value }) => value ?? '') profileId!: string
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose({ name: 'is_active' }) @Transform(({ value }) => value ?? false) isActive!: boolean
  @Expose({ name: 'password_configured' }) @Transform(({ value }) => value ?? false) passwordConfigured!: boolean
  @Expose() @Type(() => DataManagementSourceConfigDto) config!: DataManagementSourceConfigDto
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): DataManagementSourceProfileDto {
    return plainToInstance(DataManagementSourceProfileDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementSourceProfile {
    const e = new DataManagementSourceProfile()
    e.sourceType = this.sourceType
    e.profileId = this.profileId
    e.name = this.name
    e.isActive = this.isActive
    e.passwordConfigured = this.passwordConfigured
    e.config = this.config.toEntity()
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    return e
  }
}
