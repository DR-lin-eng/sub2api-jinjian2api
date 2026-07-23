import type { CompositeRouteSource } from './compositeRouteSource'
import type { CompositeRouteEndpoint } from './compositeRouteEndpoint'
import type { GroupPlatform } from './groupPlatform'
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
