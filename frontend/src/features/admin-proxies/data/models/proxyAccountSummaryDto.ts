import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { AccountPlatform } from '@/features/admin-accounts/enums/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/enums/accountType'
import { ProxyAccountSummary } from '@/features/admin-proxies/domain/models/proxyAccountSummary'

export class ProxyAccountSummaryDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  platform!: AccountPlatform

  @Expose()
  type!: AccountType

  @Expose()
  notes?: string

  static fromJson(json: unknown): ProxyAccountSummaryDto {
    return plainToInstance(ProxyAccountSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ProxyAccountSummary {
    const entity = new ProxyAccountSummary()
    entity.id = this.id
    entity.name = this.name
    entity.platform = this.platform
    entity.type = this.type
    entity.notes = this.notes
    return entity
  }
}
