import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { DataManagementS3Profile } from '@/features/admin-backup/domain/models/dataManagementS3Profile'
import { DataManagementS3ConfigDto } from '@/features/admin-backup/data/models/dataManagementS3ConfigDto'

export class DataManagementS3ProfileDto {
  @Expose({ name: 'profile_id' }) @Transform(({ value }) => value ?? '') profileId!: string
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose({ name: 'is_active' }) @Transform(({ value }) => value ?? false) isActive!: boolean
  @Expose() @Type(() => DataManagementS3ConfigDto) s3!: DataManagementS3ConfigDto
  @Expose({ name: 'secret_access_key_configured' }) @Transform(({ value }) => value ?? false) secretAccessKeyConfigured!: boolean
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): DataManagementS3ProfileDto {
    return plainToInstance(DataManagementS3ProfileDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementS3Profile {
    const e = new DataManagementS3Profile()
    e.profileId = this.profileId
    e.name = this.name
    e.isActive = this.isActive
    e.s3 = this.s3.toEntity()
    e.secretAccessKeyConfigured = this.secretAccessKeyConfigured
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    return e
  }
}
