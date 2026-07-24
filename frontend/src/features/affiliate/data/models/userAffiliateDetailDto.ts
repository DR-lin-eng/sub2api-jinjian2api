import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserAffiliateDetail } from '@/features/affiliate/domain/models/userAffiliateDetail'
import { AffiliateInviteeDto } from './affiliateInviteeDto'

export class UserAffiliateDetailDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'aff_code' })
  @Transform(({ value }) => value ?? '')
  affCode!: string

  @Expose({ name: 'aff_count' })
  @Transform(({ value }) => value ?? 0)
  affCount!: number

  @Expose({ name: 'aff_quota' })
  @Transform(({ value }) => value ?? 0)
  affQuota!: number

  @Expose({ name: 'aff_frozen_quota' })
  @Transform(({ value }) => value ?? 0)
  affFrozenQuota!: number

  @Expose({ name: 'aff_history_quota' })
  @Transform(({ value }) => value ?? 0)
  affHistoryQuota!: number

  @Expose({ name: 'effective_rebate_rate_percent' })
  @Transform(({ value }) => value ?? 0)
  effectiveRebateRatePercent!: number

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => AffiliateInviteeDto)
  invitees!: AffiliateInviteeDto[]

  @Expose({ name: 'inviter_id' })
  inviterId?: number | null

  static fromJson(json: unknown): UserAffiliateDetailDto {
    return plainToInstance(UserAffiliateDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAffiliateDetail {
    const e = new UserAffiliateDetail()
    e.userId = this.userId
    e.affCode = this.affCode
    e.affCount = this.affCount
    e.affQuota = this.affQuota
    e.affFrozenQuota = this.affFrozenQuota
    e.affHistoryQuota = this.affHistoryQuota
    e.effectiveRebateRatePercent = this.effectiveRebateRatePercent
    e.invitees = (this.invitees ?? []).map(d => d.toEntity())
    e.inviterId = this.inviterId
    return e
  }
}
