import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { BalanceHistoryItem } from '@/features/admin-users/domain/models/balanceHistoryItem'
import { BalanceHistoryUserRefDto } from '@/features/admin-users/data/models/balanceHistoryUserRefDto'
import { BalanceHistoryGroupRefDto } from '@/features/admin-users/data/models/balanceHistoryGroupRefDto'

export class BalanceHistoryItemDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  code!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  type!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  value!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  status!: string

  @Expose({ name: 'used_by' })
  @Transform(({ value }) => value ?? 0)
  usedBy!: number

  @Expose({ name: 'used_at' })
  @Transform(({ value }) => value ?? '')
  usedAt!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose({ name: 'validity_days' })
  @Transform(({ value }) => value ?? 0)
  validityDays!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  notes!: string

  @Expose()
  @Type(() => BalanceHistoryUserRefDto)
  user?: BalanceHistoryUserRefDto

  @Expose()
  @Type(() => BalanceHistoryGroupRefDto)
  group?: BalanceHistoryGroupRefDto

  static fromJson(json: unknown): BalanceHistoryItemDto {
    return plainToInstance(BalanceHistoryItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BalanceHistoryItem {
    const entity = new BalanceHistoryItem()
    entity.id = this.id
    entity.code = this.code
    entity.type = this.type
    entity.value = this.value
    entity.status = this.status
    entity.usedBy = this.usedBy
    entity.usedAt = this.usedAt
    entity.createdAt = this.createdAt
    entity.groupId = this.groupId
    entity.validityDays = this.validityDays
    entity.notes = this.notes
    entity.userInfo = this.user ? this.user.toEntity() : undefined
    entity.groupInfo = this.group ? this.group.toEntity() : undefined
    return entity
  }
}
