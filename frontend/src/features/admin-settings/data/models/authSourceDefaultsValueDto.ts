import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AuthSourceDefaultsValue } from '@/features/admin-settings/domain/models/authSourceDefaultsValue'
import { DefaultSubscriptionSettingDto } from './defaultSubscriptionSettingDto'
import type { DefaultPlatformQuotasMap } from '@/features/admin-settings/domain/models/adminSettings'

export class AuthSourceDefaultsValueDto {
  @Expose() @Transform(({ value }) => value ?? 0) balance!: number
  @Expose() @Transform(({ value }) => value ?? 5) concurrency!: number

  @Expose()
  @Type(() => DefaultSubscriptionSettingDto)
  subscriptions!: DefaultSubscriptionSettingDto[]

  @Expose({ name: 'grant_on_signup' }) @Transform(({ value }) => value ?? false) grantOnSignup!: boolean
  @Expose({ name: 'grant_on_first_bind' }) @Transform(({ value }) => value ?? false) grantOnFirstBind!: boolean
  @Expose({ name: 'platform_quotas' }) @Transform(({ value }) => value ?? {}) platformQuotas!: DefaultPlatformQuotasMap

  static fromJson(json: unknown): AuthSourceDefaultsValueDto {
    return plainToInstance(AuthSourceDefaultsValueDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AuthSourceDefaultsValue {
    const e = new AuthSourceDefaultsValue()
    e.balance = this.balance
    e.concurrency = this.concurrency
    e.subscriptions = (this.subscriptions ?? []).map(s => s.toEntity())
    e.grantOnSignup = this.grantOnSignup
    e.grantOnFirstBind = this.grantOnFirstBind
    e.platformQuotas = this.platformQuotas
    return e
  }
}
