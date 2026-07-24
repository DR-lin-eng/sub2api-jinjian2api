export type RedeemCodeType = 'balance' | 'concurrency' | 'subscription' | 'invitation'

export class RedeemCode {
  id!: number
  code!: string
  type!: RedeemCodeType
  value!: number
  status!: 'active' | 'used' | 'expired' | 'unused' | 'disabled'
  maxUses!: number
  usedCount!: number
  maxUsesPerUser!: number
  usedBy!: number | null
  usedAt!: string | null
  createdAt!: string
  expiresAt!: string | null
  updatedAt!: string
  notes!: string
  groupId!: number | null
  validityDays!: number
}
