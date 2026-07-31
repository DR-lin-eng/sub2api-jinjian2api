import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsErrorLogDto } from './opsErrorLogDto'
import { OpsErrorDetail } from '@/features/admin-ops/domain/models/opsErrorDetail'

export class OpsErrorDetailDto extends OpsErrorLogDto {
  @Expose({ name: 'error_body' }) @Transform(({ value }) => value ?? '') errorBody!: string
  @Expose({ name: 'upstream_status_code' }) @Transform(({ value }) => value ?? 0) upstreamStatusCode!: number
  @Expose({ name: 'upstream_error_message' }) @Transform(({ value }) => value ?? '') upstreamErrorMessage!: string
  @Expose({ name: 'upstream_error_detail' }) @Transform(({ value }) => value ?? '') upstreamErrorDetail!: string
  @Expose({ name: 'upstream_errors' }) @Transform(({ value }) => value ?? '') upstreamErrors!: string
  @Expose({ name: 'auth_latency_ms' }) @Transform(({ value }) => value ?? 0) authLatencyMs!: number
  @Expose({ name: 'routing_latency_ms' }) @Transform(({ value }) => value ?? 0) routingLatencyMs!: number
  @Expose({ name: 'upstream_latency_ms' }) @Transform(({ value }) => value ?? 0) upstreamLatencyMs!: number
  @Expose({ name: 'response_latency_ms' }) @Transform(({ value }) => value ?? 0) responseLatencyMs!: number
  @Expose({ name: 'time_to_first_token_ms' }) @Transform(({ value }) => value ?? 0) timeToFirstTokenMs!: number
  @Expose({ name: 'is_business_limited' }) @Transform(({ value }) => value ?? false) isBusinessLimited!: boolean
  @Expose({ name: 'api_key_prefix' }) @Transform(({ value }) => value ?? '') apiKeyPrefix!: string

  static fromJson(json: unknown): OpsErrorDetailDto {
    return plainToInstance(OpsErrorDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsErrorDetail {
    const base = super.toEntity()
    const e = new OpsErrorDetail()
    Object.assign(e, base)
    e.errorBody = this.errorBody
    e.upstreamStatusCode = this.upstreamStatusCode
    e.upstreamErrorMessage = this.upstreamErrorMessage
    e.upstreamErrorDetail = this.upstreamErrorDetail
    e.upstreamErrors = this.upstreamErrors
    e.authLatencyMs = this.authLatencyMs
    e.routingLatencyMs = this.routingLatencyMs
    e.upstreamLatencyMs = this.upstreamLatencyMs
    e.responseLatencyMs = this.responseLatencyMs
    e.timeToFirstTokenMs = this.timeToFirstTokenMs
    e.isBusinessLimited = this.isBusinessLimited
    e.apiKeyPrefix = this.apiKeyPrefix
    return e
  }
}
