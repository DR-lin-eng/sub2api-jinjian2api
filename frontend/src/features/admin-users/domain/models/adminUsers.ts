import type { UserSubscription } from '@/features/admin-subscriptions/domain/models/subscription'

export interface AdminUser {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  balance: number
  frozenBalance?: number
  concurrency: number
  rpmLimit?: number
  status: 'active' | 'disabled'
  allowedGroups: number[] | null
  notes: string
  lastUsedAt?: string | null
  lastActiveAt?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  currentConcurrency?: number
  groupRates?: Record<number, number>
  subscriptions?: UserSubscription[]
}

export interface UpdateUserRequest {
  email?: string
  password?: string
  username?: string
  notes?: string
  role?: 'admin' | 'user'
  balance?: number
  concurrency?: number
  rpmLimit?: number
  status?: 'active' | 'disabled'
  allowedGroups?: number[] | null
  groupRates?: Record<number, number | null>
}

export interface AdminBindAuthIdentityRequest {
  provider: string
  provider_subject: string
}

export interface PlatformQuotaItem {
  platform: string
  window: string
  limit: number
  used: number
  resetAt?: string | null
}

export interface PlatformQuotaUpdateItem {
  platform: string
  window: string
  limit: number
}

export type PlatformQuotaPlatform = 'anthropic' | 'openai' | 'gemini' | string
export type PlatformQuotaWindow = 'daily' | 'weekly' | 'monthly' | string

export interface PlatformQuotasResponse {
  quotas: PlatformQuotaItem[]
}

