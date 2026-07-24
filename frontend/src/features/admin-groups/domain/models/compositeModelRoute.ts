import type { CompositeRouteMatchType } from '@/features/admin-groups/enums/compositeRouteMatchType'
import type { CompositeRouteEndpoint } from '@/features/admin-groups/enums/compositeRouteEndpoint'
import type { GroupPlatform } from '@/features/admin-groups/enums/groupPlatform'

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
