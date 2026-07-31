import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { ModelStat } from '@/features/admin-dashboard/domain/models/modelStat'
import type { EndpointStat } from '@/core/models/domain/endpointStat'
import { AccountUsageStatsResponse } from '@/features/admin-accounts/domain/models/accountUsageStatsResponse'
import { AccountUsageSummary } from '@/features/admin-accounts/domain/models/accountUsageSummary'
import { AccountUsageHistoryDto } from '@/features/admin-accounts/data/models/accountUsageHistoryDto'
import { AccountUsageSummaryDto } from '@/features/admin-accounts/data/models/accountUsageSummaryDto'

export class AccountUsageStatsResponseDto {
  @Expose() @Type(() => AccountUsageHistoryDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) history!: AccountUsageHistoryDto[]
  @Expose() @Type(() => AccountUsageSummaryDto) summary!: AccountUsageSummaryDto
  @Expose() @Transform(({ value }) => value ?? []) models!: ModelStat[]
  @Expose() @Transform(({ value }) => value ?? []) endpoints!: EndpointStat[]
  @Expose({ name: 'upstream_endpoints' }) @Transform(({ value }) => value ?? []) upstreamEndpoints!: EndpointStat[]

  static fromJson(json: unknown): AccountUsageStatsResponseDto {
    return plainToInstance(AccountUsageStatsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageStatsResponse {
    const e = new AccountUsageStatsResponse()
    e.history = (this.history ?? []).map(dto => dto.toEntity())
    e.summary = this.summary ? this.summary.toEntity() : new AccountUsageSummary()
    e.models = this.models
    e.endpoints = this.endpoints
    e.upstreamEndpoints = this.upstreamEndpoints
    return e
  }
}
