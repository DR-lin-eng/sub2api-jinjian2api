import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { AccountPlatform } from '@/features/admin-accounts/domain/models/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/domain/models/accountType'
import { AdminDataAccount } from '@/features/admin-accounts/domain/models/adminDataAccount'

export class AdminDataAccountDto {
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') notes!: string
  @Expose() platform!: AccountPlatform
  @Expose() type!: AccountType
  @Expose() @Transform(({ value }) => value ?? {}) credentials!: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? {}) extra!: Record<string, unknown>
  @Expose({ name: 'proxy_key' }) @Transform(({ value }) => value ?? '') proxyKey!: string
  @Expose() @Transform(({ value }) => value ?? 1) concurrency!: number
  @Expose() @Transform(({ value }) => value ?? 0) priority!: number
  @Expose({ name: 'rate_multiplier' }) @Transform(({ value }) => value ?? 1) rateMultiplier!: number
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? 0) expiresAt!: number
  @Expose({ name: 'auto_pause_on_expired' }) @Transform(({ value }) => value ?? false) autoPauseOnExpired!: boolean

  static fromJson(json: unknown): AdminDataAccountDto {
    return plainToInstance(AdminDataAccountDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminDataAccount {
    const e = new AdminDataAccount()
    e.name = this.name
    e.notes = this.notes
    e.platform = this.platform
    e.type = this.type
    e.credentials = this.credentials
    e.extra = this.extra
    e.proxyKey = this.proxyKey
    e.concurrency = this.concurrency
    e.priority = this.priority
    e.rateMultiplier = this.rateMultiplier
    e.expiresAt = this.expiresAt
    e.autoPauseOnExpired = this.autoPauseOnExpired
    return e
  }
}
