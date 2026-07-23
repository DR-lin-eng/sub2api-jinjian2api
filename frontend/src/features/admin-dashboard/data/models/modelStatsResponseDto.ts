import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { ModelStatDto } from './modelStatDto'
import { ModelStatsResponse } from '@/features/admin-dashboard/domain/models/modelStatsResponse'

export class ModelStatsResponseDto {
  @Expose()
  @Type(() => ModelStatDto)
  models!: ModelStatDto[]

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  static fromJson(json: unknown): ModelStatsResponseDto {
    return plainToInstance(ModelStatsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelStatsResponse {
    const entity = new ModelStatsResponse()
    entity.models = (this.models ?? []).map(d => d.toEntity())
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    return entity
  }
}
