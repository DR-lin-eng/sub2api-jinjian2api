import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RedeemCode } from '@/features/admin-redeem/domain/models/redeemCode'

export class RedeemCodeDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  code!: string

  @Expose()
  @Transform(({ value }) => value ?? 'balance')
  type!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  value!: number

  @Expose()
  @Transform(({ value }) => value ?? 'unused')
  status!: string

  @Expose({ name: 'max_uses' })
  @Transform(({ value }) => value ?? 0)
  maxUses!: number

  @Expose({ name: 'used_count' })
  @Transform(({ value }) => value ?? 0)
  usedCount!: number

  @Expose({ name: 'max_uses_per_user' })
  @Transform(({ value }) => value ?? 0)
  maxUsesPerUser!: number

  @Expose({ name: 'used_by' })
  @Transform(({ value }) => value ?? null)
  usedBy!: number | null

  @Expose({ name: 'used_at' })
  @Transform(({ value }) => value ?? null)
  usedAt!: string | null

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? null)
  expiresAt!: string | null

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  notes!: string

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? null)
  groupId!: number | null

  @Expose({ name: 'validity_days' })
  @Transform(({ value }) => value ?? 0)
  validityDays!: number

  static fromJson(json: unknown): RedeemCodeDto {
    return plainToInstance(RedeemCodeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RedeemCode {
    const entity = new RedeemCode()
    entity.id = this.id
    entity.code = this.code
    entity.type = this.type as RedeemCode['type']
    entity.value = this.value
    entity.status = this.status as RedeemCode['status']
    entity.maxUses = this.maxUses
    entity.usedCount = this.usedCount
    entity.maxUsesPerUser = this.maxUsesPerUser
    entity.usedBy = this.usedBy
    entity.usedAt = this.usedAt
    entity.createdAt = this.createdAt
    entity.expiresAt = this.expiresAt
    entity.updatedAt = this.updatedAt
    entity.notes = this.notes
    entity.groupId = this.groupId
    entity.validityDays = this.validityDays
    return entity
  }
}
