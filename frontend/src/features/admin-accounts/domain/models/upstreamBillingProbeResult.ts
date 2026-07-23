import { UpstreamBillingProbeSnapshot } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSnapshot'

export class UpstreamBillingProbeResult {
  accountId!: number
  snapshot?: UpstreamBillingProbeSnapshot
  error!: string
}

export { UpstreamBillingProbeSnapshot } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSnapshot'
