export class PromoCode {
  id!: number
  code!: string
  bonusAmount!: number
  maxUses!: number
  usedCount!: number
  status!: 'active' | 'disabled'
  expiresAt!: string
  notes!: string
  createdAt!: string
  updatedAt!: string
}
