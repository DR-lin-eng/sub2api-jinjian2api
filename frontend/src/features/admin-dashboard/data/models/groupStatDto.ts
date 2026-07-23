import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GroupStat } from '@/features/admin-dashboard/domain/models/groupStat'

export class GroupStatDto {
  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  cost!: number

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => value ?? 0)
  actualCost!: number

  @Expose({ name: 'account_cost' })
  accountCost?: number

  static fromJson(json: unknown): GroupStatDto {
    return plainToInstance(GroupStatDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GroupStat {
    const entity = new GroupStat()
    entity.groupId = this.groupId
    entity.groupName = this.groupName
    entity.requests = this.requests
    entity.totalTokens = this.totalTokens
    entity.cost = this.cost
    entity.actualCost = this.actualCost
    entity.accountCost = this.accountCost
    return entity
  }
}
