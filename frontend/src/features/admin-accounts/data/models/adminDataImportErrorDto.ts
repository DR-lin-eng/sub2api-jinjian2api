import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminDataImportError } from '@/features/admin-accounts/domain/models/adminDataImportError'

export class AdminDataImportErrorDto {
  @Expose() kind!: 'proxy' | 'account'
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose({ name: 'proxy_key' }) @Transform(({ value }) => value ?? '') proxyKey!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string

  static fromJson(json: unknown): AdminDataImportErrorDto {
    return plainToInstance(AdminDataImportErrorDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminDataImportError {
    const e = new AdminDataImportError()
    e.kind = this.kind
    e.name = this.name
    e.proxyKey = this.proxyKey
    e.message = this.message
    return e
  }
}
