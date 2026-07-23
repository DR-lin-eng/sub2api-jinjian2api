import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'
import { AdminDataImportErrorDto } from '@/features/admin-accounts/data/models/adminDataImportErrorDto'

export class AdminDataImportResultDto {
  @Expose({ name: 'proxy_created' }) @Transform(({ value }) => value ?? 0) proxyCreated!: number
  @Expose({ name: 'proxy_reused' }) @Transform(({ value }) => value ?? 0) proxyReused!: number
  @Expose({ name: 'proxy_failed' }) @Transform(({ value }) => value ?? 0) proxyFailed!: number
  @Expose({ name: 'account_created' }) @Transform(({ value }) => value ?? 0) accountCreated!: number
  @Expose({ name: 'account_failed' }) @Transform(({ value }) => value ?? 0) accountFailed!: number
  @Expose() @Type(() => AdminDataImportErrorDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) errors!: AdminDataImportErrorDto[]

  static fromJson(json: unknown): AdminDataImportResultDto {
    return plainToInstance(AdminDataImportResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminDataImportResult {
    const e = new AdminDataImportResult()
    e.proxyCreated = this.proxyCreated
    e.proxyReused = this.proxyReused
    e.proxyFailed = this.proxyFailed
    e.accountCreated = this.accountCreated
    e.accountFailed = this.accountFailed
    e.errors = (this.errors ?? []).map(dto => dto.toEntity())
    return e
  }
}
