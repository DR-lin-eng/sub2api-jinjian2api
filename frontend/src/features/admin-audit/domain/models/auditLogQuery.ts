export interface AuditLogQuery {
  page?: number
  pageSize?: number
  startTime?: string
  endTime?: string
  actorUserId?: number
  actorEmail?: string
  authMethod?: string
  action?: string
  method?: string
  clientIp?: string
  success?: string
  q?: string
}
