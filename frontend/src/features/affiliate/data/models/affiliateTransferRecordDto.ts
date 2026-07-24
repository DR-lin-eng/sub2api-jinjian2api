import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateTransferRecord } from '@/features/affiliate/domain/models/affiliateTransferRecord'

export class AffiliateTransferRecordDto {
  @Expose({ name: 'ledger_id' })
  @Transform(({ value }) => value ?? 0)
  ledgerId!: number

  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'user_email' })
  @Transform(({ value }) => value ?? '')
  userEmail!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  amount!: number

  @Expose({ name: 'balance_after' })
  @Transform(({ value }) => value ?? null)
  balanceAfter!: number | null

  @Expose({ name: 'available_quota_after' })
  @Transform(({ value }) => value ?? null)
  availableQuotaAfter!: number | null

  @Expose({ name: 'frozen_quota_after' })
  @Transform(({ value }) => value ?? null)
  frozenQuotaAfter!: number | null

  @Expose({ name: 'history_quota_after' })
  @Transform(({ value }) => value ?? null)
  historyQuotaAfter!: number | null

  @Expose({ name: 'snapshot_available' })
  @Transform(({ value }) => value ?? false)
  snapshotAvailable!: boolean

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  static fromJson(json: unknown): AffiliateTransferRecordDto {
    return plainToInstance(AffiliateTransferRecordDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateTransferRecord {
    const e = new AffiliateTransferRecord()
    e.ledgerId = this.ledgerId
    e.userId = this.userId
    e.userEmail = this.userEmail
    e.username = this.username
    e.amount = this.amount
    e.balanceAfter = this.balanceAfter
    e.availableQuotaAfter = this.availableQuotaAfter
    e.frozenQuotaAfter = this.frozenQuotaAfter
    e.historyQuotaAfter = this.historyQuotaAfter
    e.snapshotAvailable = this.snapshotAvailable
    e.createdAt = this.createdAt
    return e
  }
}
