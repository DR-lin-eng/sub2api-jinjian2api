import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsUserUsageStatsItem, OpsUserUsageStats } from '@/features/admin-ops/domain/models/opsUserUsageStats'

export class OpsUserUsageStatsItemDto {
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'input_tokens' }) @Transform(({ value }) => value ?? 0) inputTokens!: number
  @Expose({ name: 'output_tokens' }) @Transform(({ value }) => value ?? 0) outputTokens!: number
  @Expose({ name: 'cache_tokens' }) @Transform(({ value }) => value ?? 0) cacheTokens!: number
  @Expose({ name: 'total_tokens' }) @Transform(({ value }) => value ?? 0) totalTokens!: number
  @Expose({ name: 'actual_cost' }) @Transform(({ value }) => value ?? 0) actualCost!: number
  @Expose({ name: 'last_request_at' }) @Transform(({ value }) => value ?? '') lastRequestAt!: string

  static fromJson(json: unknown): OpsUserUsageStatsItemDto {
    return plainToInstance(OpsUserUsageStatsItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsUserUsageStatsItem {
    const e = new OpsUserUsageStatsItem()
    e.userId = this.userId
    e.username = this.username
    e.email = this.email
    e.requestCount = this.requestCount
    e.inputTokens = this.inputTokens
    e.outputTokens = this.outputTokens
    e.cacheTokens = this.cacheTokens
    e.totalTokens = this.totalTokens
    e.actualCost = this.actualCost
    e.lastRequestAt = this.lastRequestAt
    return e
  }
}

export class OpsUserUsageStatsDto {
  @Expose({ name: 'time_range' }) @Transform(({ value }) => value ?? '') timeRange!: string
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose() @Type(() => OpsUserUsageStatsItemDto) @Transform(({ value }) => value ?? []) items!: OpsUserUsageStatsItemDto[]
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Transform(({ value }) => value ?? 1) page!: number
  @Expose({ name: 'page_size' }) @Transform(({ value }) => value ?? 20) pageSize!: number
  @Expose({ name: 'top_n' }) @Transform(({ value }) => value ?? 0) topN!: number

  static fromJson(json: unknown): OpsUserUsageStatsDto {
    return plainToInstance(OpsUserUsageStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsUserUsageStats {
    const e = new OpsUserUsageStats()
    e.timeRange = this.timeRange
    e.startTime = this.startTime
    e.endTime = this.endTime
    e.platform = this.platform
    e.groupId = this.groupId
    e.items = (this.items ?? []).map(d => d.toEntity())
    e.total = this.total
    e.page = this.page
    e.pageSize = this.pageSize
    e.topN = this.topN
    return e
  }
}
