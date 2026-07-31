import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import type { AccountPlatform } from '@/core/enums/accountPlatform'
import type { AccountType } from '@/core/enums/accountType'
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
