import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromoCodeUsage } from '@/features/admin-promo/domain/models/promoCodeUsage'

export class PromoCodeUsageDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'promo_code_id' })
  @Transform(({ value }) => value ?? 0)
  promoCodeId!: number

  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'bonus_amount' })
  @Transform(({ value }) => value ?? 0)
  bonusAmount!: number

  @Expose({ name: 'used_at' })
  @Transform(({ value }) => value ?? '')
  usedAt!: string

  static fromJson(json: unknown): PromoCodeUsageDto {
    return plainToInstance(PromoCodeUsageDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromoCodeUsage {
    const entity = new PromoCodeUsage()
    entity.id = this.id
    entity.promoCodeId = this.promoCodeId
    entity.userId = this.userId
    entity.bonusAmount = this.bonusAmount
    entity.usedAt = this.usedAt
    return entity
  }
}
