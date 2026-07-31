import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { GroupStatDto } from './groupStatDto'
import { GroupStatsResponse } from '@/features/admin-dashboard/domain/models/groupStatsResponse'

export class GroupStatsResponseDto {
  @Expose()
  @Type(() => GroupStatDto)
  groups!: GroupStatDto[]

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  static fromJson(json: unknown): GroupStatsResponseDto {
    return plainToInstance(GroupStatsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GroupStatsResponse {
    const entity = new GroupStatsResponse()
    entity.groups = (this.groups ?? []).map(d => d.toEntity())
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    return entity
  }
}
