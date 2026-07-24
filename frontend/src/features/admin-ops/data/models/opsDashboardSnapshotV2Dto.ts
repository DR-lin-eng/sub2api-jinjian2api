import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsDashboardSnapshotV2 } from '@/features/admin-ops/domain/models/opsDashboardSnapshotV2'
import { OpsDashboardOverviewDto } from './opsDashboardOverviewDto'
import { OpsThroughputTrendResponseDto } from './opsThroughputTrendResponseDto'
import { OpsLatencyHistogramResponseDto } from './opsLatencyHistogramResponseDto'
import { OpsErrorTrendResponseDto } from './opsErrorTrendResponseDto'
import { OpsErrorDistributionResponseDto } from './opsErrorDistributionResponseDto'

export class OpsDashboardSnapshotV2Dto {
  @Expose({ name: 'generated_at' }) @Transform(({ value }) => value ?? '') generatedAt!: string
  @Expose() @Type(() => OpsDashboardOverviewDto) overview!: OpsDashboardOverviewDto
  @Expose({ name: 'throughput_trend' }) @Type(() => OpsThroughputTrendResponseDto) throughputTrend?: OpsThroughputTrendResponseDto
  @Expose({ name: 'latency_histogram' }) @Type(() => OpsLatencyHistogramResponseDto) latencyHistogram?: OpsLatencyHistogramResponseDto
  @Expose({ name: 'error_trend' }) @Type(() => OpsErrorTrendResponseDto) errorTrend?: OpsErrorTrendResponseDto
  @Expose({ name: 'error_distribution' }) @Type(() => OpsErrorDistributionResponseDto) errorDistribution?: OpsErrorDistributionResponseDto

  static fromJson(json: unknown): OpsDashboardSnapshotV2Dto {
    return plainToInstance(OpsDashboardSnapshotV2Dto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsDashboardSnapshotV2 {
    const e = new OpsDashboardSnapshotV2()
    e.generatedAt = this.generatedAt
    e.overview = this.overview.toEntity()
    e.throughputTrend = this.throughputTrend?.toEntity()
    e.latencyHistogram = this.latencyHistogram?.toEntity()
    e.errorTrend = this.errorTrend?.toEntity()
    e.errorDistribution = this.errorDistribution?.toEntity()
    return e
  }
}
