import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsRateSummary, OpsRealtimeTrafficSummary, OpsRealtimeTrafficSummaryResponse } from '@/features/admin-ops/domain/models/opsRealtimeTrafficSummaryResponse'

export class OpsRateSummaryDto {
  @Expose() @Transform(({ value }) => value ?? 0) current!: number
  @Expose() @Transform(({ value }) => value ?? 0) peak!: number
  @Expose() @Transform(({ value }) => value ?? 0) avg!: number

  static fromJson(json: unknown): OpsRateSummaryDto {
    return plainToInstance(OpsRateSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsRateSummary {
    const e = new OpsRateSummary()
    e.current = this.current
    e.peak = this.peak
    e.avg = this.avg
    return e
  }
}

export class OpsRealtimeTrafficSummaryDto {
  @Expose() @Transform(({ value }) => value ?? '') window!: string
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose() @Type(() => OpsRateSummaryDto) qps!: OpsRateSummaryDto
  @Expose() @Type(() => OpsRateSummaryDto) tps!: OpsRateSummaryDto

  static fromJson(json: unknown): OpsRealtimeTrafficSummaryDto {
    return plainToInstance(OpsRealtimeTrafficSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsRealtimeTrafficSummary {
    const e = new OpsRealtimeTrafficSummary()
    e.window = this.window
    e.startTime = this.startTime
    e.endTime = this.endTime
    e.platform = this.platform
    e.groupId = this.groupId
    e.qps = this.qps?.toEntity() ?? new OpsRateSummary()
    e.tps = this.tps?.toEntity() ?? new OpsRateSummary()
    return e
  }
}

export class OpsRealtimeTrafficSummaryResponseDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Type(() => OpsRealtimeTrafficSummaryDto) summary?: OpsRealtimeTrafficSummaryDto
  @Expose() @Transform(({ value }) => value ?? '') timestamp!: string

  static fromJson(json: unknown): OpsRealtimeTrafficSummaryResponseDto {
    return plainToInstance(OpsRealtimeTrafficSummaryResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsRealtimeTrafficSummaryResponse {
    const e = new OpsRealtimeTrafficSummaryResponse()
    e.enabled = this.enabled
    e.summary = this.summary?.toEntity()
    e.timestamp = this.timestamp
    return e
  }
}
