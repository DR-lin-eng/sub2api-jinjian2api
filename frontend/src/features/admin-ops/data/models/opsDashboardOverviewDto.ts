import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsDashboardOverview } from '@/features/admin-ops/domain/models/opsDashboardOverview'
import { OpsPercentiles } from '@/features/admin-ops/domain/models/opsPercentiles'
import { OpsPercentilesDto } from './opsPercentilesDto'
import { OpsSystemMetricsSnapshotDto } from './opsSystemMetricsSnapshotDto'
import { OpsJobHeartbeatDto } from './opsJobHeartbeatDto'

export class OpsDashboardOverviewDto {
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'health_score' }) @Transform(({ value }) => value ?? 0) healthScore!: number
  @Expose({ name: 'system_metrics' }) @Type(() => OpsSystemMetricsSnapshotDto) systemMetrics?: OpsSystemMetricsSnapshotDto
  @Expose({ name: 'job_heartbeats' }) @Type(() => OpsJobHeartbeatDto) @Transform(({ value }) => value ?? []) jobHeartbeats!: OpsJobHeartbeatDto[]
  @Expose({ name: 'success_count' }) @Transform(({ value }) => value ?? 0) successCount!: number
  @Expose({ name: 'error_count_total' }) @Transform(({ value }) => value ?? 0) errorCountTotal!: number
  @Expose({ name: 'business_limited_count' }) @Transform(({ value }) => value ?? 0) businessLimitedCount!: number
  @Expose({ name: 'error_count_sla' }) @Transform(({ value }) => value ?? 0) errorCountSla!: number
  @Expose({ name: 'request_count_total' }) @Transform(({ value }) => value ?? 0) requestCountTotal!: number
  @Expose({ name: 'request_count_sla' }) @Transform(({ value }) => value ?? 0) requestCountSla!: number
  @Expose({ name: 'token_consumed' }) @Transform(({ value }) => value ?? 0) tokenConsumed!: number
  @Expose() @Transform(({ value }) => value ?? 0) sla!: number
  @Expose({ name: 'error_rate' }) @Transform(({ value }) => value ?? 0) errorRate!: number
  @Expose({ name: 'upstream_error_rate' }) @Transform(({ value }) => value ?? 0) upstreamErrorRate!: number
  @Expose({ name: 'upstream_error_count_excl_429_529' }) @Transform(({ value }) => value ?? 0) upstreamErrorCountExcl429529!: number
  @Expose({ name: 'upstream_429_count' }) @Transform(({ value }) => value ?? 0) upstream429Count!: number
  @Expose({ name: 'upstream_529_count' }) @Transform(({ value }) => value ?? 0) upstream529Count!: number
  @Expose() @Transform(({ value }) => value ?? {}) qps!: { current: number; peak: number; avg: number }
  @Expose() @Transform(({ value }) => value ?? {}) tps!: { current: number; peak: number; avg: number }
  @Expose() @Type(() => OpsPercentilesDto) duration!: OpsPercentilesDto
  @Expose() @Type(() => OpsPercentilesDto) ttft!: OpsPercentilesDto

  static fromJson(json: unknown): OpsDashboardOverviewDto {
    return plainToInstance(OpsDashboardOverviewDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsDashboardOverview {
    const e = new OpsDashboardOverview()
    e.startTime = this.startTime
    e.endTime = this.endTime
    e.platform = this.platform
    e.groupId = this.groupId
    e.healthScore = this.healthScore
    e.systemMetrics = this.systemMetrics?.toEntity()
    e.jobHeartbeats = (this.jobHeartbeats ?? []).map(d => d.toEntity())
    e.successCount = this.successCount
    e.errorCountTotal = this.errorCountTotal
    e.businessLimitedCount = this.businessLimitedCount
    e.errorCountSla = this.errorCountSla
    e.requestCountTotal = this.requestCountTotal
    e.requestCountSla = this.requestCountSla
    e.tokenConsumed = this.tokenConsumed
    e.sla = this.sla
    e.errorRate = this.errorRate
    e.upstreamErrorRate = this.upstreamErrorRate
    e.upstreamErrorCountExcl429529 = this.upstreamErrorCountExcl429529
    e.upstream429Count = this.upstream429Count
    e.upstream529Count = this.upstream529Count
    e.qpsCurrent = this.qps?.current ?? 0
    e.qpsPeak = this.qps?.peak ?? 0
    e.qpsAvg = this.qps?.avg ?? 0
    e.tpsCurrent = this.tps?.current ?? 0
    e.tpsPeak = this.tps?.peak ?? 0
    e.tpsAvg = this.tps?.avg ?? 0
    e.duration = this.duration?.toEntity() ?? new OpsPercentiles()
    e.ttft = this.ttft?.toEntity() ?? new OpsPercentiles()
    return e
  }
}
