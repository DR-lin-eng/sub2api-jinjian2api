import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DataManagementSourceConfig } from '@/features/admin-backup/domain/models/dataManagementSourceConfig'

export class DataManagementSourceConfigDto {
  @Expose() @Transform(({ value }) => value ?? '') host!: string
  @Expose() @Transform(({ value }) => value ?? 0) port!: number
  @Expose() @Transform(({ value }) => value ?? '') user!: string
  @Expose() @Transform(({ value }) => value ?? '') password!: string
  @Expose() @Transform(({ value }) => value ?? '') database!: string
  @Expose({ name: 'ssl_mode' }) @Transform(({ value }) => value ?? '') sslMode!: string
  @Expose() @Transform(({ value }) => value ?? '') addr!: string
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose() @Transform(({ value }) => value ?? 0) db!: number
  @Expose({ name: 'container_name' }) @Transform(({ value }) => value ?? '') containerName!: string

  static fromJson(json: unknown): DataManagementSourceConfigDto {
    return plainToInstance(DataManagementSourceConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DataManagementSourceConfig {
    const e = new DataManagementSourceConfig()
    e.host = this.host
    e.port = this.port
    e.user = this.user
    e.password = this.password
    e.database = this.database
    e.sslMode = this.sslMode
    e.addr = this.addr
    e.username = this.username
    e.db = this.db
    e.containerName = this.containerName
    return e
  }
}
