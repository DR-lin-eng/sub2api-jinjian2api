export interface RefundOrderRequest {
  amount: number
  reason: string
  deduct_balance?: boolean
  force?: boolean
}
