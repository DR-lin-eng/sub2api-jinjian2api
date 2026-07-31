import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminDataProxy } from '@/features/admin-accounts/domain/models/adminDataProxy'

export class AdminDataProxyDto {
  @Expose({ name: 'proxy_key' }) @Transform(({ value }) => value ?? '') proxyKey!: string
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') protocol!: string
  @Expose() @Transform(({ value }) => value ?? '') host!: string
  @Expose() @Transform(({ value }) => value ?? 0) port!: number
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose() @Transform(({ value }) => value ?? '') password!: string
  @Expose() @Transform(({ value }) => value ?? 'inactive') status!: 'active' | 'inactive'

  static fromJson(json: unknown): AdminDataProxyDto {
    return plainToInstance(AdminDataProxyDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminDataProxy {
    const e = new AdminDataProxy()
    e.proxyKey = this.proxyKey
    e.name = this.name
    e.protocol = this.protocol
    e.host = this.host
    e.port = this.port
    e.username = this.username
    e.password = this.password
    e.status = this.status
    return e
  }
}
