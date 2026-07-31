import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminUsageStatsResponse } from '@/features/admin-usage/domain/models/adminUsageStatsResponse'
import type { EndpointStat } from '@/core/models/domain/endpointStat'

export class AdminUsageStatsResponseDto {
  @Expose({ name: 'total_requests' }) @Transform(({ value }) => value ?? 0) totalRequests!: number
  @Expose({ name: 'total_input_tokens' }) @Transform(({ value }) => value ?? 0) totalInputTokens!: number
  @Expose({ name: 'total_output_tokens' }) @Transform(({ value }) => value ?? 0) totalOutputTokens!: number
  @Expose({ name: 'total_cache_tokens' }) @Transform(({ value }) => value ?? 0) totalCacheTokens!: number
  @Expose({ name: 'total_cache_creation_tokens' }) @Transform(({ value }) => value ?? 0) totalCacheCreationTokens!: number
  @Expose({ name: 'total_cache_read_tokens' }) @Transform(({ value }) => value ?? 0) totalCacheReadTokens!: number
  @Expose({ name: 'total_tokens' }) @Transform(({ value }) => value ?? 0) totalTokens!: number
  @Expose({ name: 'total_cost' }) @Transform(({ value }) => value ?? 0) totalCost!: number
  @Expose({ name: 'total_actual_cost' }) @Transform(({ value }) => value ?? 0) totalActualCost!: number
  @Expose({ name: 'total_account_cost' }) @Transform(({ value }) => value ?? 0) totalAccountCost!: number
  @Expose({ name: 'average_duration_ms' }) @Transform(({ value }) => value ?? 0) averageDurationMs!: number
  @Expose() @Transform(({ value }) => value ?? {}) models!: Record<string, number>
  @Expose() endpoints?: EndpointStat[]
  @Expose({ name: 'upstream_endpoints' }) upstreamEndpoints?: EndpointStat[]
  @Expose({ name: 'endpoint_paths' }) endpointPaths?: EndpointStat[]

  static fromJson(json: unknown): AdminUsageStatsResponseDto {
    return plainToInstance(AdminUsageStatsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminUsageStatsResponse {
    const e = new AdminUsageStatsResponse()
    e.totalRequests = this.totalRequests
    e.totalInputTokens = this.totalInputTokens
    e.totalOutputTokens = this.totalOutputTokens
    e.totalCacheTokens = this.totalCacheTokens
    e.totalCacheCreationTokens = this.totalCacheCreationTokens
    e.totalCacheReadTokens = this.totalCacheReadTokens
    e.totalTokens = this.totalTokens
    e.totalCost = this.totalCost
    e.totalActualCost = this.totalActualCost
    e.totalAccountCost = this.totalAccountCost
    e.averageDurationMs = this.averageDurationMs
    e.models = this.models
    e.endpoints = this.endpoints
    e.upstreamEndpoints = this.upstreamEndpoints
    e.endpointPaths = this.endpointPaths
    return e
  }
}
