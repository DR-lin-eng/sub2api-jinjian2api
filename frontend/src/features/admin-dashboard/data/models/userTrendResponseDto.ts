import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { UserUsageTrendPointDto } from './userUsageTrendPointDto'
import { UserTrendResponse } from '@/features/admin-dashboard/domain/models/userTrendResponse'

export class UserTrendResponseDto {
  @Expose()
  @Type(() => UserUsageTrendPointDto)
  trend!: UserUsageTrendPointDto[]

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  granularity!: string

  static fromJson(json: unknown): UserTrendResponseDto {
    return plainToInstance(UserTrendResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserTrendResponse {
    const entity = new UserTrendResponse()
    entity.trend = (this.trend ?? []).map(d => d.toEntity())
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    entity.granularity = this.granularity
    return entity
  }
}
