export interface RedeemHistoryItem {
  id: number
  code: string
  type: string
  value: number
  status: string
  usedAt: string
  createdAt: string
  notes?: string
  groupId?: number
  validityDays?: number
}

export interface RedeemCodeResult {
  message: string
  type: string
  value: number
  newBalance?: number
  newConcurrency?: number
}

export interface RedeemCodeRequest {
  code: string
}
