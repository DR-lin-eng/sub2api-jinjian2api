import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeem'

export interface RedeemHistoryItemDto {
  id: number
  code: string
  type: string
  value: number
  status: string
  used_at: string
  created_at: string
  notes?: string
  group_id?: number
  validity_days?: number
}

export function toEntity(dto: RedeemHistoryItemDto): RedeemHistoryItem {
  return {
    id: dto.id ?? 0,
    code: dto.code ?? '',
    type: dto.type ?? '',
    value: dto.value ?? 0,
    status: dto.status ?? '',
    usedAt: dto.used_at ?? '',
    createdAt: dto.created_at ?? '',
    notes: dto.notes,
    groupId: dto.group_id,
    validityDays: dto.validity_days,
  }
}
