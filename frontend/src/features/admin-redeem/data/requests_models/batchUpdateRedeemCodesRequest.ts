export interface BatchUpdateRedeemCodesRequest {
  ids: number[]
  fields: {
    status?: 'unused' | 'disabled'
    expires_at?: string | null
    notes?: string
    group_id?: number | null
  }
}
