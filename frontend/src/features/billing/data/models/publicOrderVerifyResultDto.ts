import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PublicOrderVerifyResult } from '@/features/billing/domain/models/publicOrderVerifyResult'

export class PublicOrderVerifyResultDto {
  @Expose({ name: 'out_trade_no' })
  @Transform(({ value }) => value ?? '')
  outTradeNo!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  status!: string

  @Expose()
  @Transform(({ value }) => value ?? false)
  paid!: boolean

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  static fromJson(json: unknown): PublicOrderVerifyResultDto {
    return plainToInstance(PublicOrderVerifyResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PublicOrderVerifyResult {
    const entity = new PublicOrderVerifyResult()
    entity.outTradeNo = this.outTradeNo
    entity.status = this.status
    entity.paid = this.paid
    entity.createdAt = this.createdAt
    entity.expiresAt = this.expiresAt
    return entity
  }
}
