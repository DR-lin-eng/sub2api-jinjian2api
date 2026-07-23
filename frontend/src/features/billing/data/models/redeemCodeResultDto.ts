import type { RedeemCodeResult } from '@/features/billing/domain/models/redeem'

export interface RedeemCodeResultDto {
  message: string
  type: string
  value: number
  new_balance?: number
  new_concurrency?: number
}

export function toEntity(dto: RedeemCodeResultDto): RedeemCodeResult {
  return {
    message: dto.message ?? '',
    type: dto.type ?? '',
    value: dto.value ?? 0,
    newBalance: dto.new_balance,
    newConcurrency: dto.new_concurrency,
  }
}
