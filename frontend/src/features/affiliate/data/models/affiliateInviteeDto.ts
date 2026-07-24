import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateInvitee } from '@/features/affiliate/domain/models/affiliateInvitee'

export class AffiliateInviteeDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose({ name: 'total_rebate' })
  @Transform(({ value }) => value ?? 0)
  totalRebate!: number

  @Expose({ name: 'created_at' })
  createdAt?: string

  static fromJson(json: unknown): AffiliateInviteeDto {
    return plainToInstance(AffiliateInviteeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateInvitee {
    const e = new AffiliateInvitee()
    e.userId = this.userId
    e.email = this.email
    e.username = this.username
    e.totalRebate = this.totalRebate
    e.createdAt = this.createdAt
    return e
  }
}
