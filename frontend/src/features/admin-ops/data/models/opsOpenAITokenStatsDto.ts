import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsOpenAITokenStatsItem, OpsOpenAITokenStats } from '@/features/admin-ops/domain/models/opsOpenAITokenStats'

export class OpsOpenAITokenStatsItemDto {
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'avg_tokens_per_sec' }) @Transform(({ value }) => value ?? 0) avgTokensPerSec!: number
  @Expose({ name: 'avg_first_token_ms' }) @Transform(({ value }) => value ?? 0) avgFirstTokenMs!: number
  @Expose({ name: 'total_output_tokens' }) @Transform(({ value }) => value ?? 0) totalOutputTokens!: number
  @Expose({ name: 'avg_duration_ms' }) @Transform(({ value }) => value ?? 0) avgDurationMs!: number
  @Expose({ name: 'requests_with_first_token' }) @Transform(({ value }) => value ?? 0) requestsWithFirstToken!: number

  static fromJson(json: unknown): OpsOpenAITokenStatsItemDto {
    return plainToInstance(OpsOpenAITokenStatsItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsOpenAITokenStatsItem {
    const e = new OpsOpenAITokenStatsItem()
    e.model = this.model
    e.requestCount = this.requestCount
    e.avgTokensPerSec = this.avgTokensPerSec
    e.avgFirstTokenMs = this.avgFirstTokenMs
    e.totalOutputTokens = this.totalOutputTokens
    e.avgDurationMs = this.avgDurationMs
    e.requestsWithFirstToken = this.requestsWithFirstToken
    return e
  }
}

export class OpsOpenAITokenStatsDto {
  @Expose({ name: 'time_range' }) @Transform(({ value }) => value ?? '') timeRange!: string
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose() @Type(() => OpsOpenAITokenStatsItemDto) @Transform(({ value }) => value ?? []) items!: OpsOpenAITokenStatsItemDto[]
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Transform(({ value }) => value ?? 1) page!: number
  @Expose({ name: 'page_size' }) @Transform(({ value }) => value ?? 20) pageSize!: number
  @Expose({ name: 'top_n' }) @Transform(({ value }) => value ?? 0) topN!: number

  static fromJson(json: unknown): OpsOpenAITokenStatsDto {
    return plainToInstance(OpsOpenAITokenStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsOpenAITokenStats {
    const e = new OpsOpenAITokenStats()
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
