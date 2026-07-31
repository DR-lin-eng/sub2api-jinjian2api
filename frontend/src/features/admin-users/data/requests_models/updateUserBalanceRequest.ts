export interface UpdateUserBalanceRequest {
  balance: number
  operation: 'set' | 'add' | 'subtract'
  notes?: string
}
