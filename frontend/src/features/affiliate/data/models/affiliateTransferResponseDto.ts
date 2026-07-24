import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateTransferResponse } from '@/features/affiliate/domain/models/affiliateTransferResponse'

export class AffiliateTransferResponseDto {
  @Expose({ name: 'transferred_quota' })
  @Transform(({ value }) => value ?? 0)
  transferredQuota!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  balance!: number

  static fromJson(json: unknown): AffiliateTransferResponseDto {
    return plainToInstance(AffiliateTransferResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateTransferResponse {
    const e = new AffiliateTransferResponse()
    e.transferredQuota = this.transferredQuota
    e.balance = this.balance
    return e
  }
}
