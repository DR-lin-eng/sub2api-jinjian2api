import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DataManagementRedisConfig } from '@/features/admin-backup/domain/models/dataManagementRedisConfig'

export class DataManagementRedisConfigDto {
  @Expose() @Transform(({ value }) => value ?? '') addr!: string
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose() @Transform(({ value }) => value ?? '') password!: string
  @Expose({ name: 'password_configured' }) @Transform(({ value }) => value ?? false) passwordConfigured!: boolean
  @Expose() @Transform(({ value }) => value ?? 0) db!: number
  @Expose({ name: 'container_name' }) @Transform(({ value }) => value ?? '') containerName!: string

  static fromJson(json: unknown): DataManagementRedisConfigDto {
    return plainToInstance(DataManagementRedisConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementRedisConfig {
    const e = new DataManagementRedisConfig()
    e.addr = this.addr
    e.username = this.username
    e.password = this.password
    e.passwordConfigured = this.passwordConfigured
    e.db = this.db
    e.containerName = this.containerName
    return e
  }
}
