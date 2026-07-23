import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AuditLog } from '@/features/admin-audit/domain/models/auditLog'

export class AuditLogDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'actor_user_id' })
  actorUserId?: number

  @Expose({ name: 'actor_email' })
  @Transform(({ value }) => value ?? '')
  actorEmail!: string

  @Expose({ name: 'actor_role' })
  @Transform(({ value }) => value ?? '')
  actorRole!: string

  @Expose({ name: 'auth_method' })
  @Transform(({ value }) => value ?? '')
  authMethod!: string

  @Expose({ name: 'credential_masked' })
  @Transform(({ value }) => value ?? '')
  credentialMasked!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  action!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  method!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  path!: string

  @Expose({ name: 'request_id' })
  @Transform(({ value }) => value ?? '')
  requestId!: string

  @Expose({ name: 'client_ip' })
  @Transform(({ value }) => value ?? '')
  clientIp!: string

  @Expose({ name: 'user_agent' })
  @Transform(({ value }) => value ?? '')
  userAgent!: string

  @Expose({ name: 'request_body' })
  requestBody?: string

  @Expose({ name: 'status_code' })
  @Transform(({ value }) => value ?? 0)
  statusCode!: number

  @Expose({ name: 'latency_ms' })
  @Transform(({ value }) => value ?? 0)
  latencyMs!: number

  @Expose()
  extra?: Record<string, unknown>

  static fromJson(json: unknown): AuditLogDto {
    return plainToInstance(AuditLogDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AuditLog {
    const entity = new AuditLog()
    entity.id = this.id
    entity.createdAt = this.createdAt
    entity.actorUserId = this.actorUserId
    entity.actorEmail = this.actorEmail
    entity.actorRole = this.actorRole
    entity.authMethod = this.authMethod
    entity.credentialMasked = this.credentialMasked
    entity.action = this.action
    entity.method = this.method
    entity.path = this.path
    entity.requestId = this.requestId
    entity.clientIp = this.clientIp
    entity.userAgent = this.userAgent
    entity.requestBody = this.requestBody
    entity.statusCode = this.statusCode
    entity.latencyMs = this.latencyMs
    entity.extra = this.extra
    return entity
  }
}
