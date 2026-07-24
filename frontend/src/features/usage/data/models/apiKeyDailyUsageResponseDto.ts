import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { ApiKeyDailyUsageResponse } from '@/features/usage/domain/models/apiKeyDailyUsageResponse'
import { ApiKeyDailyUsagePointDto } from './apiKeyDailyUsagePointDto'

export class ApiKeyDailyUsageResponseDto {
  @Expose()
  @Type(() => ApiKeyDailyUsagePointDto)
  items!: ApiKeyDailyUsagePointDto[]

  @Expose()
  @Transform(({ value }) => value ?? 0)
  days!: number

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  static fromJson(json: unknown): ApiKeyDailyUsageResponseDto {
    return plainToInstance(ApiKeyDailyUsageResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ApiKeyDailyUsageResponse {
    const entity = new ApiKeyDailyUsageResponse()
    entity.items = (this.items ?? []).map(d => d.toEntity())
    entity.days = this.days
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    return entity
  }
}
