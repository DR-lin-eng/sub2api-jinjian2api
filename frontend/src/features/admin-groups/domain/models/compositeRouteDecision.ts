import type { CompositeRouteSource } from '@/features/admin-groups/enums/compositeRouteSource'
import type { CompositeRouteEndpoint } from '@/features/admin-groups/enums/compositeRouteEndpoint'
import type { GroupPlatform } from '@/features/admin-groups/enums/groupPlatform'
import type { CompositeModelRoute } from './compositeModelRoute'

export class CompositeRouteDecision {
  matched!: boolean
  source!: CompositeRouteSource
  groupId!: number
  publicModel!: string
  targetPlatform!: Exclude<GroupPlatform, 'composite'> | ''
  upstreamModel!: string
  endpoint!: CompositeRouteEndpoint
  route?: CompositeModelRoute
  reason?: string
}
