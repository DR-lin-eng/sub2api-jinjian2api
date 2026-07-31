export interface ListAuditLogRequest {
  page?: number
  page_size?: number
  start_time?: string
  end_time?: string
  actor_user_id?: number
  actor_email?: string
  auth_method?: string
  action?: string
  method?: string
  client_ip?: string
  success?: string
  q?: string
}
