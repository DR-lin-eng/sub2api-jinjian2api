import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AdminDashboardSnapshotV2Response } from '@/features/admin-dashboard/domain/models/adminDashboardSnapshotV2Response'
import { DashboardStatsDto } from '@/features/admin-dashboard/data/models/dashboardStatsDto'
import { TrendDataPointDto } from '@/features/admin-dashboard/data/models/trendDataPointDto'
import { ModelStatDto } from '@/features/admin-dashboard/data/models/modelStatDto'
import { GroupStatDto } from '@/features/admin-dashboard/data/models/groupStatDto'
import { UserUsageTrendPointDto } from '@/features/admin-dashboard/data/models/userUsageTrendPointDto'
import { UserSpendingRankingItemDto } from '@/features/admin-dashboard/data/models/userSpendingRankingItemDto'

export class AdminDashboardSnapshotV2ResponseDto {
  @Expose({ name: 'generated_at' })
  @Transform(({ value }) => value ?? '')
  generatedAt!: string

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  granularity!: string

  @Expose()
  @Type(() => DashboardStatsDto)
  stats?: DashboardStatsDto

  @Expose()
  @Type(() => TrendDataPointDto)
  trend?: TrendDataPointDto[]

  @Expose()
  @Type(() => ModelStatDto)
  models?: ModelStatDto[]

  @Expose()
  @Type(() => GroupStatDto)
  groups?: GroupStatDto[]

  @Expose({ name: 'users_trend' })
  @Type(() => UserUsageTrendPointDto)
  usersTrend?: UserUsageTrendPointDto[]

  @Expose()
  @Type(() => UserSpendingRankingItemDto)
  ranking?: UserSpendingRankingItemDto[]

  @Expose({ name: 'ranking_total_actual_cost' })
  rankingTotalActualCost?: number

  @Expose({ name: 'ranking_total_requests' })
  rankingTotalRequests?: number

  @Expose({ name: 'ranking_total_tokens' })
  rankingTotalTokens?: number

  static fromJson(json: unknown): AdminDashboardSnapshotV2ResponseDto {
    return plainToInstance(AdminDashboardSnapshotV2ResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminDashboardSnapshotV2Response {
    const entity = new AdminDashboardSnapshotV2Response()
    entity.generatedAt = this.generatedAt
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    entity.granularity = this.granularity
    entity.stats = this.stats?.toEntity()
    entity.trend = this.trend?.map((d) => d.toEntity())
    entity.models = this.models?.map((d) => d.toEntity())
    entity.groups = this.groups?.map((d) => d.toEntity())
    entity.usersTrend = this.usersTrend?.map((d) => d.toEntity())
    entity.ranking = this.ranking?.map((d) => d.toEntity())
    entity.rankingTotalActualCost = this.rankingTotalActualCost
    entity.rankingTotalRequests = this.rankingTotalRequests
    entity.rankingTotalTokens = this.rankingTotalTokens
    return entity
  }
}
