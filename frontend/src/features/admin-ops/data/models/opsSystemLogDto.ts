import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsSystemLog } from '@/features/admin-ops/domain/models/opsSystemLog'

export class OpsSystemLogDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose() @Transform(({ value }) => value ?? '') host!: string
  @Expose() @Transform(({ value }) => value ?? '') level!: string
  @Expose() @Transform(({ value }) => value ?? '') component!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string
  @Expose({ name: 'request_id' }) @Transform(({ value }) => value ?? '') requestId!: string
  @Expose({ name: 'client_request_id' }) @Transform(({ value }) => value ?? '') clientRequestId!: string
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'api_key_id' }) @Transform(({ value }) => value ?? 0) apiKeyId!: number
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose() @Transform(({ value }) => value ?? {}) extra!: Record<string, unknown>

  static fromJson(json: unknown): OpsSystemLogDto {
    return plainToInstance(OpsSystemLogDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsSystemLog {
    const e = new OpsSystemLog()
    e.id = this.id
    e.createdAt = this.createdAt
    e.host = this.host
    e.level = this.level
    e.component = this.component
    e.message = this.message
    e.requestId = this.requestId
    e.clientRequestId = this.clientRequestId
    e.userId = this.userId
    e.apiKeyId = this.apiKeyId
    e.accountId = this.accountId
    e.platform = this.platform
    e.model = this.model
    e.extra = this.extra
    return e
  }
}
