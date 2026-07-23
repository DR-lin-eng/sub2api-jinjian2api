import type { PublicOrderVerifyResult } from '@/features/billing/domain/models/payment'

export interface PublicOrderVerifyResultDto {
  out_trade_no: string
  status: string
  paid: boolean
  created_at: string
  expires_at: string
}

export function toEntity(dto: PublicOrderVerifyResultDto): PublicOrderVerifyResult {
  return {
    outTradeNo: dto.out_trade_no ?? '',
    status: dto.status ?? '',
    paid: dto.paid ?? false,
    createdAt: dto.created_at ?? '',
    expiresAt: dto.expires_at ?? '',
  }
}

