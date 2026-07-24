import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsErrorLog } from '@/features/admin-ops/domain/models/opsErrorLog'

export class OpsErrorLogDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose() @Transform(({ value }) => value ?? '') phase!: string
  @Expose() @Transform(({ value }) => value ?? '') type!: string
  @Expose({ name: 'error_owner' }) @Transform(({ value }) => value ?? '') errorOwner!: string
  @Expose({ name: 'error_source' }) @Transform(({ value }) => value ?? '') errorSource!: string
  @Expose() @Transform(({ value }) => value ?? '') severity!: string
  @Expose({ name: 'status_code' }) @Transform(({ value }) => value ?? 0) statusCode!: number
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose() @Transform(({ value }) => value ?? false) resolved!: boolean
  @Expose({ name: 'resolved_at' }) @Transform(({ value }) => value ?? '') resolvedAt!: string
  @Expose({ name: 'resolved_by_user_id' }) @Transform(({ value }) => value ?? 0) resolvedByUserId!: number
  @Expose({ name: 'client_request_id' }) @Transform(({ value }) => value ?? '') clientRequestId!: string
  @Expose({ name: 'request_id' }) @Transform(({ value }) => value ?? '') requestId!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'user_email' }) @Transform(({ value }) => value ?? '') userEmail!: string
  @Expose({ name: 'api_key_id' }) @Transform(({ value }) => value ?? 0) apiKeyId!: number
  @Expose({ name: 'api_key_name' }) @Transform(({ value }) => value ?? '') apiKeyName!: string
  @Expose({ name: 'api_key_deleted' }) @Transform(({ value }) => value ?? false) apiKeyDeleted!: boolean
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose({ name: 'account_name' }) @Transform(({ value }) => value ?? '') accountName!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose({ name: 'client_ip' }) @Transform(({ value }) => value ?? '') clientIp!: string
  @Expose({ name: 'request_path' }) @Transform(({ value }) => value ?? '') requestPath!: string
  @Expose() @Transform(({ value }) => value ?? false) stream!: boolean
  @Expose({ name: 'inbound_endpoint' }) @Transform(({ value }) => value ?? '') inboundEndpoint!: string
  @Expose({ name: 'upstream_endpoint' }) @Transform(({ value }) => value ?? '') upstreamEndpoint!: string
  @Expose({ name: 'requested_model' }) @Transform(({ value }) => value ?? '') requestedModel!: string
  @Expose({ name: 'upstream_model' }) @Transform(({ value }) => value ?? '') upstreamModel!: string
  @Expose({ name: 'request_type' }) @Transform(({ value }) => value ?? 0) requestType!: number
  @Expose({ name: 'user_agent' }) @Transform(({ value }) => value ?? '') userAgent!: string

  static fromJson(json: unknown): OpsErrorLogDto {
    return plainToInstance(OpsErrorLogDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsErrorLog {
    const e = new OpsErrorLog()
    e.id = this.id
    e.createdAt = this.createdAt
    e.phase = this.phase
    e.type = this.type
    e.errorOwner = this.errorOwner
    e.errorSource = this.errorSource
    e.severity = this.severity
    e.statusCode = this.statusCode
    e.platform = this.platform
    e.model = this.model
    e.resolved = this.resolved
    e.resolvedAt = this.resolvedAt
    e.resolvedByUserId = this.resolvedByUserId
    e.clientRequestId = this.clientRequestId
    e.requestId = this.requestId
    e.message = this.message
    e.userId = this.userId
    e.userEmail = this.userEmail
    e.apiKeyId = this.apiKeyId
    e.apiKeyName = this.apiKeyName
    e.apiKeyDeleted = this.apiKeyDeleted
    e.accountId = this.accountId
    e.accountName = this.accountName
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.clientIp = this.clientIp
    e.requestPath = this.requestPath
    e.stream = this.stream
    e.inboundEndpoint = this.inboundEndpoint
    e.upstreamEndpoint = this.upstreamEndpoint
    e.requestedModel = this.requestedModel
    e.upstreamModel = this.upstreamModel
    e.requestType = this.requestType
    e.userAgent = this.userAgent
    return e
  }
}
