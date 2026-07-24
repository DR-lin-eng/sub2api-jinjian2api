export interface DeleteEventsByFilterRequest {
  filter: Record<string, unknown>
  snapshot_max_id: number
  filter_hash: string
  confirmation_token: string
  confirm: true
}
