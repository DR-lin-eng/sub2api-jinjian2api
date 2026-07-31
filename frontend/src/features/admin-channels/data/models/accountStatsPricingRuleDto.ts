import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AccountStatsPricingRule } from '@/features/admin-channels/domain/models/accountStatsPricingRule'
import { ChannelModelPricingDto } from '@/features/admin-channels/data/models/channelModelPricingDto'

export class AccountStatsPricingRuleDto {
  @Expose()
  id?: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose({ name: 'group_ids' })
  @Transform(({ value }) => value ?? [])
  groupIds!: number[]

  @Expose({ name: 'account_ids' })
  @Transform(({ value }) => value ?? [])
  accountIds!: number[]

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => ChannelModelPricingDto)
  pricing!: ChannelModelPricingDto[]

  static fromJson(json: unknown): AccountStatsPricingRuleDto {
    return plainToInstance(AccountStatsPricingRuleDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountStatsPricingRule {
    const entity = new AccountStatsPricingRule()
    entity.id = this.id
    entity.name = this.name
    entity.groupIds = this.groupIds
    entity.accountIds = this.accountIds
    entity.pricing = this.pricing.map(p => p.toEntity())
    return entity
  }
}
