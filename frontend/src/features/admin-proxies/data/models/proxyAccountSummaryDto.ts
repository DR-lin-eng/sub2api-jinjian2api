import type { ProxyAccountSummary } from '@/features/admin-proxies/domain/models/proxy'
import type { AccountPlatform, AccountType } from '@/types'
export interface ProxyAccountSummaryDto {
  id: number
  name: string
  platform: AccountPlatform
  type: AccountType
  notes?: string | null
}

export function toEntity(dto: ProxyAccountSummaryDto): ProxyAccountSummary {
  return {
    id: dto.id ?? 0,
    name: dto.name ?? '',
    platform: dto.platform,
    type: dto.type,
    notes: dto.notes,
  }
}
