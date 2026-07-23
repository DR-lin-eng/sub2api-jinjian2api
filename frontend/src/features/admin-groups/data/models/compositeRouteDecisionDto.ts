import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { CompositeRouteDecision } from '@/features/admin-groups/domain/models/compositeRouteDecision'
import { CompositeModelRouteDto } from './compositeModelRouteDto'
import type { CompositeRouteSource } from '@/features/admin-groups/domain/models/compositeRouteSource'
import type { CompositeRouteEndpoint } from '@/features/admin-groups/domain/models/compositeRouteEndpoint'
import type { GroupPlatform } from '@/features/admin-groups/domain/models/groupPlatform'

export class CompositeRouteDecisionDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  matched!: boolean

  @Expose()
  @Transform(({ value }) => value ?? 'route')
  source!: CompositeRouteSource

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose({ name: 'public_model' })
  @Transform(({ value }) => value ?? '')
  publicModel!: string

  @Expose({ name: 'target_platform' })
  @Transform(({ value }) => value ?? '')
  targetPlatform!: Exclude<GroupPlatform, 'composite'> | ''

  @Expose({ name: 'upstream_model' })
  @Transform(({ value }) => value ?? '')
  upstreamModel!: string

  @Expose()
  @Transform(({ value }) => value ?? 'any')
  endpoint!: CompositeRouteEndpoint

  @Expose()
  @Type(() => CompositeModelRouteDto)
  route?: CompositeModelRouteDto

  @Expose()
  reason?: string

  static fromJson(json: unknown): CompositeRouteDecisionDto {
    return plainToInstance(CompositeRouteDecisionDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CompositeRouteDecision {
    const entity = new CompositeRouteDecision()
    entity.matched = this.matched
    entity.source = this.source
    entity.groupId = this.groupId
    entity.publicModel = this.publicModel
    entity.targetPlatform = this.targetPlatform
    entity.upstreamModel = this.upstreamModel
    entity.endpoint = this.endpoint
    entity.route = this.route?.toEntity()
    entity.reason = this.reason
    return entity
  }
}
