export type RedeemCodeType = 'balance' | 'concurrency' | 'subscription' | 'invitation'

export interface RedeemCode {
  id: number
  code: string
  type: RedeemCodeType
  value: number
  status: 'active' | 'used' | 'expired' | 'unused' | 'disabled'
  maxUses: number
  usedCount: number
  maxUsesPerUser: number
  usedBy: number | null
  usedAt: string | null
  createdAt: string
  expiresAt?: string | null
  updatedAt?: string
  notes?: string
  groupId?: number | null
  validityDays?: number
}

export interface GenerateRedeemCodesRequest {
  count: number
  type: RedeemCodeType
  value: number
  groupId?: number | null
  validityDays?: number
  expiresAt?: string | null
  expiresInDays?: number
  maxUses?: number
  maxUsesPerUser?: number
}

export interface BatchUpdateRedeemCodeFields {
  status?: 'unused' | 'disabled'
  expiresAt?: string | null
  notes?: string
  groupId?: number | null
}

export interface BatchUpdateRedeemCodesRequest {
  ids: number[]
  fields: BatchUpdateRedeemCodeFields
}
