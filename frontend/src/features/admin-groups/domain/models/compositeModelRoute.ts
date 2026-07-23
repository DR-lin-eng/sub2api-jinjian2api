import type { CompositeRouteMatchType } from './compositeRouteMatchType'
import type { CompositeRouteEndpoint } from './compositeRouteEndpoint'
import type { GroupPlatform } from './groupPlatform'

export class CompositeModelRoute {
  id!: number
  groupId!: number
  publicModel!: string
  matchType!: CompositeRouteMatchType
  targetPlatform!: Exclude<GroupPlatform, 'composite'>
  upstreamModel!: string
  endpoint!: CompositeRouteEndpoint
  priority!: number
  enabled!: boolean
  notes!: string
  createdAt?: string
  updatedAt?: string
}
