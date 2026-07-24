import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CompositeModelRoute } from '@/features/admin-groups/domain/models/compositeModelRoute'
import type { CompositeRouteMatchType } from '@/features/admin-groups/enums/compositeRouteMatchType'
import type { CompositeRouteEndpoint } from '@/features/admin-groups/enums/compositeRouteEndpoint'
import type { GroupPlatform } from '@/features/admin-groups/enums/groupPlatform'

export class CompositeModelRouteDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose({ name: 'public_model' })
  @Transform(({ value }) => value ?? '')
  publicModel!: string

  @Expose({ name: 'match_type' })
  @Transform(({ value }) => value ?? 'exact')
  matchType!: CompositeRouteMatchType

  @Expose({ name: 'target_platform' })
  @Transform(({ value }) => value ?? 'anthropic')
  targetPlatform!: Exclude<GroupPlatform, 'composite'>

  @Expose({ name: 'upstream_model' })
  @Transform(({ value }) => value ?? '')
  upstreamModel!: string

  @Expose()
  @Transform(({ value }) => value ?? 'any')
  endpoint!: CompositeRouteEndpoint

  @Expose()
  @Transform(({ value }) => value ?? 0)
  priority!: number

  @Expose()
  @Transform(({ value }) => value ?? true)
  enabled!: boolean

  @Expose()
  @Transform(({ value }) => value ?? '')
  notes!: string

  @Expose({ name: 'created_at' })
  createdAt?: string

  @Expose({ name: 'updated_at' })
  updatedAt?: string

  static fromJson(json: unknown): CompositeModelRouteDto {
    return plainToInstance(CompositeModelRouteDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CompositeModelRoute {
    const entity = new CompositeModelRoute()
    entity.id = this.id
    entity.groupId = this.groupId
    entity.publicModel = this.publicModel
    entity.matchType = this.matchType
    entity.targetPlatform = this.targetPlatform
    entity.upstreamModel = this.upstreamModel
    entity.endpoint = this.endpoint
    entity.priority = this.priority
    entity.enabled = this.enabled
    entity.notes = this.notes
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
