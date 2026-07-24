import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { UsageDashboardSnapshotV2Response } from '@/features/usage/domain/models/usageDashboardSnapshotV2Response'
import { TrendDataPointDto } from '@/features/admin-dashboard/data/models/trendDataPointDto'
import { ModelStatDto } from '@/features/admin-dashboard/data/models/modelStatDto'
import { GroupStatDto } from '@/features/admin-dashboard/data/models/groupStatDto'

export class UsageDashboardSnapshotV2ResponseDto {
  @Expose({ name: 'generated_at' })
  @Transform(({ value }) => value ?? '')
  generatedAt!: string

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  granularity!: string

  @Expose()
  @Type(() => TrendDataPointDto)
  trend?: TrendDataPointDto[]

  @Expose()
  @Type(() => ModelStatDto)
  models?: ModelStatDto[]

  @Expose()
  @Type(() => GroupStatDto)
  groups?: GroupStatDto[]

  static fromJson(json: unknown): UsageDashboardSnapshotV2ResponseDto {
    return plainToInstance(UsageDashboardSnapshotV2ResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UsageDashboardSnapshotV2Response {
    const entity = new UsageDashboardSnapshotV2Response()
    entity.generatedAt = this.generatedAt
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    entity.granularity = this.granularity
    entity.trend = this.trend?.map(d => d.toEntity())
    entity.models = this.models?.map(d => d.toEntity())
    entity.groups = this.groups?.map(d => d.toEntity())
    return entity
  }
}
