import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DataManagementPostgresConfig } from '@/features/admin-backup/domain/models/dataManagementPostgresConfig'

export class DataManagementPostgresConfigDto {
  @Expose() @Transform(({ value }) => value ?? '') host!: string
  @Expose() @Transform(({ value }) => value ?? 0) port!: number
  @Expose() @Transform(({ value }) => value ?? '') user!: string
  @Expose() @Transform(({ value }) => value ?? '') password!: string
  @Expose({ name: 'password_configured' }) @Transform(({ value }) => value ?? false) passwordConfigured!: boolean
  @Expose() @Transform(({ value }) => value ?? '') database!: string
  @Expose({ name: 'ssl_mode' }) @Transform(({ value }) => value ?? '') sslMode!: string
  @Expose({ name: 'container_name' }) @Transform(({ value }) => value ?? '') containerName!: string

  static fromJson(json: unknown): DataManagementPostgresConfigDto {
    return plainToInstance(DataManagementPostgresConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementPostgresConfig {
    const e = new DataManagementPostgresConfig()
    e.host = this.host
    e.port = this.port
    e.user = this.user
    e.password = this.password
    e.passwordConfigured = this.passwordConfigured
    e.database = this.database
    e.sslMode = this.sslMode
    e.containerName = this.containerName
    return e
  }
}
