import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { EndpointStat } from '@/features/admin-dashboard/domain/models/endpointStat'

export class EndpointStatDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  endpoint!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  cost!: number

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => value ?? 0)
  actualCost!: number

  static fromJson(json: unknown): EndpointStatDto {
    return plainToInstance(EndpointStatDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): EndpointStat {
    const entity = new EndpointStat()
    entity.endpoint = this.endpoint
    entity.requests = this.requests
    entity.totalTokens = this.totalTokens
    entity.cost = this.cost
    entity.actualCost = this.actualCost
    return entity
  }
}
