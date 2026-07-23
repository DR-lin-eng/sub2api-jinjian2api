import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromoCode } from '@/features/admin-promo/domain/models/promoCode'

export class PromoCodeDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  code!: string

  @Expose({ name: 'bonus_amount' })
  @Transform(({ value }) => value ?? 0)
  bonusAmount!: number

  @Expose({ name: 'max_uses' })
  @Transform(({ value }) => value ?? 0)
  maxUses!: number

  @Expose({ name: 'used_count' })
  @Transform(({ value }) => value ?? 0)
  usedCount!: number

  @Expose()
  @Transform(({ value }) => value ?? 'active')
  status!: 'active' | 'disabled'

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  notes!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): PromoCodeDto {
    return plainToInstance(PromoCodeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromoCode {
    const entity = new PromoCode()
    entity.id = this.id
    entity.code = this.code
    entity.bonusAmount = this.bonusAmount
    entity.maxUses = this.maxUses
    entity.usedCount = this.usedCount
    entity.status = this.status
    entity.expiresAt = this.expiresAt
    entity.notes = this.notes
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
