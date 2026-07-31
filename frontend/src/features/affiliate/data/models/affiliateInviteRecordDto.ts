import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateInviteRecord } from '@/features/affiliate/domain/models/affiliateInviteRecord'

export class AffiliateInviteRecordDto {
  @Expose({ name: 'inviter_id' })
  @Transform(({ value }) => value ?? 0)
  inviterId!: number

  @Expose({ name: 'inviter_email' })
  @Transform(({ value }) => value ?? '')
  inviterEmail!: string

  @Expose({ name: 'inviter_username' })
  @Transform(({ value }) => value ?? '')
  inviterUsername!: string

  @Expose({ name: 'invitee_id' })
  @Transform(({ value }) => value ?? 0)
  inviteeId!: number

  @Expose({ name: 'invitee_email' })
  @Transform(({ value }) => value ?? '')
  inviteeEmail!: string

  @Expose({ name: 'invitee_username' })
  @Transform(({ value }) => value ?? '')
  inviteeUsername!: string

  @Expose({ name: 'aff_code' })
  @Transform(({ value }) => value ?? '')
  affCode!: string

  @Expose({ name: 'total_rebate' })
  @Transform(({ value }) => value ?? 0)
  totalRebate!: number

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  static fromJson(json: unknown): AffiliateInviteRecordDto {
    return plainToInstance(AffiliateInviteRecordDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateInviteRecord {
    const e = new AffiliateInviteRecord()
    e.inviterId = this.inviterId
    e.inviterEmail = this.inviterEmail
    e.inviterUsername = this.inviterUsername
    e.inviteeId = this.inviteeId
    e.inviteeEmail = this.inviteeEmail
    e.inviteeUsername = this.inviteeUsername
    e.affCode = this.affCode
    e.totalRebate = this.totalRebate
    e.createdAt = this.createdAt
    return e
  }
}
