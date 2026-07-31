import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateUserOverview } from '@/features/affiliate/domain/models/affiliateUserOverview'

export class AffiliateUserOverviewDto {
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

  @Expose({ name: 'rebate_rate_percent' })
  @Transform(({ value }) => value ?? 0)
  rebateRatePercent!: number

  @Expose({ name: 'invited_count' })
  @Transform(({ value }) => value ?? 0)
  invitedCount!: number

  @Expose({ name: 'rebated_invitee_count' })
  @Transform(({ value }) => value ?? 0)
  rebatedInviteeCount!: number

  @Expose({ name: 'available_quota' })
  @Transform(({ value }) => value ?? 0)
  availableQuota!: number

  @Expose({ name: 'history_quota' })
  @Transform(({ value }) => value ?? 0)
  historyQuota!: number

  static fromJson(json: unknown): AffiliateUserOverviewDto {
    return plainToInstance(AffiliateUserOverviewDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateUserOverview {
    const e = new AffiliateUserOverview()
    e.userId = this.userId
    e.email = this.email
    e.username = this.username
    e.affCode = this.affCode
    e.rebateRatePercent = this.rebateRatePercent
    e.invitedCount = this.invitedCount
    e.rebatedInviteeCount = this.rebatedInviteeCount
    e.availableQuota = this.availableQuota
    e.historyQuota = this.historyQuota
    return e
  }
}
