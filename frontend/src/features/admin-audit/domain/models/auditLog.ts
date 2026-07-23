export class AuditLog {
  id!: number
  createdAt!: string
  actorUserId?: number
  actorEmail!: string
  actorRole!: string
  authMethod!: string
  credentialMasked!: string
  action!: string
  method!: string
  path!: string
  requestId!: string
  clientIp!: string
  userAgent!: string
  requestBody?: string
  statusCode!: number
  latencyMs!: number
  extra?: Record<string, unknown>
}
