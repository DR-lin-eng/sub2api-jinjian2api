// Barrel re-export module for legacy `adminGroups` import paths.
// Existing callers import { AdminGroup, Group, GroupPlatform, SubscriptionType } from here.
export type { AdminGroup } from './adminGroup'
export type { Group } from '@/core/models/domain/group'
export type { GroupPlatform } from '@/core/enums/groupPlatform'
export type { SubscriptionType } from '@/core/enums/subscriptionType'
