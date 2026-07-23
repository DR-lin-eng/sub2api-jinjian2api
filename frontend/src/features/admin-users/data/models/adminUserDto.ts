import type { AdminUser } from '@/features/admin-users/domain/models/adminUsers'

export interface AdminUserDto {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  balance: number
  frozen_balance?: number
  concurrency: number
  rpm_limit?: number
  status: 'active' | 'disabled'
  allowed_groups: number[] | null
  notes: string
  last_used_at?: string | null
  last_active_at?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  current_concurrency?: number
  group_rates?: Record<number, number>
}

export function toEntity(dto: AdminUserDto): AdminUser {
  return {
    id: dto.id ?? 0,
    username: dto.username ?? '',
    email: dto.email ?? '',
    role: dto.role ?? 'user',
    balance: dto.balance ?? 0,
    frozenBalance: dto.frozen_balance,
    concurrency: dto.concurrency ?? 0,
    rpmLimit: dto.rpm_limit,
    status: dto.status ?? 'active',
    allowedGroups: dto.allowed_groups ?? null,
    notes: dto.notes ?? '',
    lastUsedAt: dto.last_used_at,
    lastActiveAt: dto.last_active_at,
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
    deletedAt: dto.deleted_at,
    currentConcurrency: dto.current_concurrency,
    groupRates: dto.group_rates,
  }
}
