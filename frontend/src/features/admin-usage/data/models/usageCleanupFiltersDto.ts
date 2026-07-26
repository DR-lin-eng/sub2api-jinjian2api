import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UsageCleanupFilters } from '@/features/admin-usage/domain/models/usageCleanupFilters'
import type { UsageRequestType } from '@/core/models/domain/usageLog'

export class UsageCleanupFiltersDto {
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'api_key_id' }) @Transform(({ value }) => value ?? 0) apiKeyId!: number
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose({ name: 'request_type' }) @Transform(({ value }) => value ?? '') requestType!: UsageRequestType | ''
  @Expose() @Transform(({ value }) => value ?? false) stream!: boolean
  @Expose({ name: 'billing_type' }) @Transform(({ value }) => value ?? 0) billingType!: number

  static fromJson(json: unknown): UsageCleanupFiltersDto {
    return plainToInstance(UsageCleanupFiltersDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UsageCleanupFilters {
    const e = new UsageCleanupFilters()
    e.startTime = this.startTime
    e.endTime = this.endTime
    e.userId = this.userId
    e.apiKeyId = this.apiKeyId
    e.accountId = this.accountId
    e.groupId = this.groupId
    e.model = this.model
    e.requestType = this.requestType
    e.stream = this.stream
    e.billingType = this.billingType
    return e
  }
}
