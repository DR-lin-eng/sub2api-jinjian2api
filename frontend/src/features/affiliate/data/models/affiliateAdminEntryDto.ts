import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateAdminEntry } from '@/features/affiliate/domain/models/affiliateAdminEntry'

export class AffiliateAdminEntryDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose({ name: 'aff_code' })
  @Transform(({ value }) => value ?? '')
  affCode!: string

  @Expose({ name: 'aff_code_custom' })
  @Transform(({ value }) => value ?? false)
  affCodeCustom!: boolean

  @Expose({ name: 'aff_rebate_rate_percent' })
  @Transform(({ value }) => value ?? null)
  affRebateRatePercent!: number | null

  @Expose({ name: 'aff_count' })
  @Transform(({ value }) => value ?? 0)
  affCount!: number

  static fromJson(json: unknown): AffiliateAdminEntryDto {
    return plainToInstance(AffiliateAdminEntryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateAdminEntry {
    const e = new AffiliateAdminEntry()
    e.userId = this.userId
    e.email = this.email
    e.username = this.username
    e.affCode = this.affCode
    e.affCodeCustom = this.affCodeCustom
    e.affRebateRatePercent = this.affRebateRatePercent
    e.affCount = this.affCount
    return e
  }
}
