import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DashboardRealtimeMetrics } from '@/features/admin-dashboard/domain/models/dashboardRealtimeMetrics'

export class DashboardRealtimeMetricsDto {
  @Expose({ name: 'active_requests' })
  @Transform(({ value }) => value ?? 0)
  activeRequests!: number

  @Expose({ name: 'requests_per_minute' })
  @Transform(({ value }) => value ?? 0)
  requestsPerMinute!: number

  @Expose({ name: 'average_response_time' })
  @Transform(({ value }) => value ?? 0)
  averageResponseTime!: number

  @Expose({ name: 'error_rate' })
  @Transform(({ value }) => value ?? 0)
  errorRate!: number

  static fromJson(json: unknown): DashboardRealtimeMetricsDto {
    return plainToInstance(DashboardRealtimeMetricsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DashboardRealtimeMetrics {
    const entity = new DashboardRealtimeMetrics()
    entity.activeRequests = this.activeRequests
    entity.requestsPerMinute = this.requestsPerMinute
    entity.averageResponseTime = this.averageResponseTime
    entity.errorRate = this.errorRate
    return entity
  }
}
