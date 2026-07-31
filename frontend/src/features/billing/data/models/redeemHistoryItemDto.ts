import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'

export class RedeemHistoryItemDto {
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

  @Expose({ name: 'used_at' })
  @Transform(({ value }) => value ?? '')
  usedAt!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose()
  notes?: string

  @Expose({ name: 'group_id' })
  groupId?: number

  @Expose({ name: 'validity_days' })
  validityDays?: number

  @Expose({ name: 'group_name' })
  groupName?: string

  static fromJson(json: unknown): RedeemHistoryItemDto {
    return plainToInstance(RedeemHistoryItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RedeemHistoryItem {
    const entity = new RedeemHistoryItem()
    entity.id = this.id
    entity.code = this.code
    entity.type = this.type
    entity.value = this.value
    entity.status = this.status
    entity.usedAt = this.usedAt
    entity.createdAt = this.createdAt
    entity.notes = this.notes
    entity.groupId = this.groupId
    entity.validityDays = this.validityDays
    entity.groupName = this.groupName
    return entity
  }
}
