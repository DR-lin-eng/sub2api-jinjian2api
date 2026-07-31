import type { Group } from '@/core/models/domain/group'

// Pure domain entity — camelCase, no null/undefined for scalar fields.
// Defaults are populated by ApiKeyDto's @Transform decorators.
export class ApiKey {
  id!: number
  userId!: number
  key!: string
  name!: string
  groupId!: number         // 0 = no group
  status!: 'active' | 'inactive' | 'quota_exhausted' | 'expired'
  ipWhitelist!: string[]
  ipBlacklist!: string[]
  lastUsedAt!: string      // '' when never used
  lastUsedIp!: string      // '' when never used
  quota!: number
  quotaUsed!: number
  expiresAt!: string       // '' when never expires
  createdAt!: string
  updatedAt!: string
  concurrencyLimit!: number
  currentConcurrency!: number
  group?: Group            // optional nested entity; absent when not populated
  rateLimit5h!: number
  rateLimit1d!: number
  rateLimit7d!: number
  usage5h!: number
  usage1d!: number
  usage7d!: number
  window5hStart!: string   // '' when no window
  window1dStart!: string
  window7dStart!: string
  reset5hAt!: string       // '' when not scheduled
  reset1dAt!: string
  reset7dAt!: string
}
