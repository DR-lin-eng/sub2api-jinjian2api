import type {
  BatchUpdateRedeemCodesRequest,
  BatchUpdateRedeemCodeFields,
} from '@/features/admin-redeem/domain/models/redeem'

interface BatchUpdateRedeemCodeFieldsDto {
  status?: 'unused' | 'disabled'
  expires_at?: string | null
  notes?: string
  group_id?: number | null
}

function fieldsToEntity(dto: BatchUpdateRedeemCodeFieldsDto): BatchUpdateRedeemCodeFields {
  return {
    status: dto.status,
    expiresAt: dto.expires_at ?? null,
    notes: dto.notes,
    groupId: dto.group_id ?? null,
  }
}

export interface BatchUpdateRedeemCodesRequestDto {
  ids: number[]
  fields: BatchUpdateRedeemCodeFieldsDto
}

export function toEntity(dto: BatchUpdateRedeemCodesRequestDto): BatchUpdateRedeemCodesRequest {
  return {
    ids: dto.ids,
    fields: fieldsToEntity(dto.fields),
  }
}
