import type { UsageLog, AdminUsageLog } from '@/features/admin-usage/domain/models/adminUsage'

export const toUsageLog = (d: UsageLog): UsageLog => d
export const toAdminUsageLog = (d: AdminUsageLog): AdminUsageLog => d
