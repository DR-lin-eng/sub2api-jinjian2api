import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { TrendDataPointDto } from './trendDataPointDto'
import { TrendResponse } from '@/features/admin-dashboard/domain/models/trendResponse'
import { TrendDataPoint } from '@/features/admin-dashboard/domain/models/trendDataPoint'

export class TrendResponseDto {
  @Expose()
  @Type(() => TrendDataPointDto)
  trend!: TrendDataPointDto[]

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  granularity!: string

  static fromJson(json: unknown): TrendResponseDto {
    return plainToInstance(TrendResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TrendResponse {
    const entity = new TrendResponse()
    entity.trend = (this.trend ?? []).map((d: TrendDataPointDto) => d.toEntity()) as TrendDataPoint[]
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    entity.granularity = this.granularity
    return entity
  }
}
