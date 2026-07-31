import type { GrokBillingSummary } from '@/features/admin-accounts/domain/models/grokBillingSummary'
import { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'
import { GrokQuotaSnapshot } from '@/features/admin-accounts/domain/models/grokQuotaSnapshot'

export class GrokQuotaProbeResult {
  source!: 'active_probe' | 'billing_probe' | 'hybrid_probe'
  model!: string
  billing?: GrokBillingSummary
  snapshot?: GrokQuotaSnapshot
  localUsage24h?: WindowStats
  localUsage7d?: WindowStats
  localUsageMonthly?: WindowStats
  statusCode!: number
  headersObserved!: boolean
  resetSupported!: boolean
  fetchedAt!: number
  persisted!: boolean
  probeError!: string
}
