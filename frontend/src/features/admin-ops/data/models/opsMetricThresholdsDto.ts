import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsMetricThresholds } from '@/features/admin-ops/domain/models/opsMetricThresholds'

export class OpsMetricThresholdsDto {
  @Expose({ name: 'sla_percent_min' }) @Transform(({ value }) => value ?? 0) slaPercentMin!: number
  @Expose({ name: 'ttft_p99_ms_max' }) @Transform(({ value }) => value ?? 0) ttftP99MsMax!: number
  @Expose({ name: 'request_error_rate_percent_max' }) @Transform(({ value }) => value ?? 0) requestErrorRatePercentMax!: number
  @Expose({ name: 'upstream_error_rate_percent_max' }) @Transform(({ value }) => value ?? 0) upstreamErrorRatePercentMax!: number

  static fromJson(json: unknown): OpsMetricThresholdsDto {
    return plainToInstance(OpsMetricThresholdsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsMetricThresholds {
    const e = new OpsMetricThresholds()
    e.slaPercentMin = this.slaPercentMin
    e.ttftP99MsMax = this.ttftP99MsMax
    e.requestErrorRatePercentMax = this.requestErrorRatePercentMax
    e.upstreamErrorRatePercentMax = this.upstreamErrorRatePercentMax
    return e
  }
}
