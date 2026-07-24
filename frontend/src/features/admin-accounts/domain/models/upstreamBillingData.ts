export type UpstreamBillingData = {
  object: 'sub2api.key_billing'
  schemaVersion: 1
  billingScope: 'token'
  groupRateMultiplier: number
  userRateMultiplier?: number
  resolvedRateMultiplier: number
  peakRateEnabled: boolean
  peakStart?: string
  peakEnd?: string
  peakRateMultiplier?: number
  appliedPeakMultiplier?: number
  effectiveRateMultiplier: number
  timezone?: string
  observedAt: string
}
