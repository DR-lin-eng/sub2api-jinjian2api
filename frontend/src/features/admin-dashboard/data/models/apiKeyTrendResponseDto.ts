import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { ApiKeyUsageTrendPointDto } from './apiKeyUsageTrendPointDto'
import { ApiKeyTrendResponse } from '@/features/admin-dashboard/domain/models/apiKeyTrendResponse'

export class ApiKeyTrendResponseDto {
  @Expose()
  @Type(() => ApiKeyUsageTrendPointDto)
  trend!: ApiKeyUsageTrendPointDto[]

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  granularity!: string

  static fromJson(json: unknown): ApiKeyTrendResponseDto {
    return plainToInstance(ApiKeyTrendResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ApiKeyTrendResponse {
    const entity = new ApiKeyTrendResponse()
    entity.trend = (this.trend ?? []).map(d => d.toEntity())
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    entity.granularity = this.granularity
    return entity
  }
}
