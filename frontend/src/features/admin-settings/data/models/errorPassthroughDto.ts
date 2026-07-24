import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ErrorPassthroughRule } from '@/features/admin-settings/domain/models/errorPassthrough'

export class ErrorPassthroughRuleDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? 0) priority!: number
  @Expose({ name: 'error_codes' }) @Transform(({ value }) => value ?? []) errorCodes!: number[]
  @Expose() @Transform(({ value }) => value ?? []) keywords!: string[]
  @Expose({ name: 'match_mode' }) @Transform(({ value }) => value ?? 'any') matchMode!: 'any' | 'all'
  @Expose() @Transform(({ value }) => value ?? []) platforms!: string[]
  @Expose({ name: 'passthrough_code' }) @Transform(({ value }) => value ?? false) passthroughCode!: boolean
  @Expose({ name: 'response_code' }) @Transform(({ value }) => value ?? null) responseCode!: number | null
  @Expose({ name: 'passthrough_body' }) @Transform(({ value }) => value ?? false) passthroughBody!: boolean
  @Expose({ name: 'custom_message' }) @Transform(({ value }) => value ?? null) customMessage!: string | null
  @Expose({ name: 'skip_monitoring' }) @Transform(({ value }) => value ?? false) skipMonitoring!: boolean
  @Expose() @Transform(({ value }) => value ?? null) description!: string | null
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): ErrorPassthroughRuleDto {
    return plainToInstance(ErrorPassthroughRuleDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ErrorPassthroughRule {
    const e = new ErrorPassthroughRule()
    e.id = this.id
    e.name = this.name
    e.enabled = this.enabled
    e.priority = this.priority
    e.errorCodes = this.errorCodes
    e.keywords = this.keywords
    e.matchMode = this.matchMode
    e.platforms = this.platforms
    e.passthroughCode = this.passthroughCode
    e.responseCode = this.responseCode
    e.passthroughBody = this.passthroughBody
    e.customMessage = this.customMessage
    e.skipMonitoring = this.skipMonitoring
    e.description = this.description
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    return e
  }
}
