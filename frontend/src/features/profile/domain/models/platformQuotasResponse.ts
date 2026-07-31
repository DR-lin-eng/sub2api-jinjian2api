import type { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'

export interface PlatformQuotasResponse {
  platform_quotas: PlatformQuotaItem[]
}
