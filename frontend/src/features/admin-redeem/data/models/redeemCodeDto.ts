import type { RedeemCode, RedeemCodeType } from '@/features/admin-redeem/domain/models/redeem'

export interface RedeemCodeDto {
  id: number
  code: string
  type: RedeemCodeType
  value: number
  status: 'active' | 'used' | 'expired' | 'unused' | 'disabled'
  max_uses: number
  used_count: number
  max_uses_per_user: number
  used_by: number | null
  used_at: string | null
  created_at: string
  expires_at?: string | null
  updated_at?: string
  notes?: string
  group_id?: number | null
  validity_days?: number
}

export function toEntity(dto: RedeemCodeDto): RedeemCode {
  return {
    id: dto.id,
    code: dto.code,
    type: dto.type,
    value: dto.value,
    status: dto.status,
    maxUses: dto.max_uses ?? 0,
    usedCount: dto.used_count ?? 0,
    maxUsesPerUser: dto.max_uses_per_user ?? 0,
    usedBy: dto.used_by ?? null,
    usedAt: dto.used_at ?? null,
    createdAt: dto.created_at,
    expiresAt: dto.expires_at ?? null,
    updatedAt: dto.updated_at,
    notes: dto.notes,
    groupId: dto.group_id ?? null,
    validityDays: dto.validity_days,
  }
}
