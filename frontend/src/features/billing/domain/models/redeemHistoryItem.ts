export class RedeemHistoryItem {
  id!: number
  code!: string
  type!: string
  value!: number
  status!: string
  usedAt!: string
  createdAt!: string
  notes?: string
  groupId?: number
  validityDays?: number
  groupName?: string
}
