import type { GenerateRedeemCodesRequest, RedeemCodeType } from '@/features/admin-redeem/domain/models/redeem'

export interface GenerateRedeemCodesRequestDto {
  count: number
  type: RedeemCodeType
  value: number
  group_id?: number | null
  validity_days?: number
  expires_at?: string | null
  expires_in_days?: number
  max_uses?: number
  max_uses_per_user?: number
}

export function toEntity(dto: GenerateRedeemCodesRequestDto): GenerateRedeemCodesRequest {
  return {
    count: dto.count,
    type: dto.type,
    value: dto.value,
    groupId: dto.group_id ?? null,
    validityDays: dto.validity_days,
    expiresAt: dto.expires_at ?? null,
    expiresInDays: dto.expires_in_days,
    maxUses: dto.max_uses,
    maxUsesPerUser: dto.max_uses_per_user,
  }
}
