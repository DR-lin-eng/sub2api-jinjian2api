export class UpstreamBillingProbeSnapshot {
  status!: 'ok' | 'unsupported' | 'failed'
  data!: Record<string, unknown>
  receivedAt!: string
  freshUntil!: string
  lastAttemptAt!: string
  nextProbeAt!: string
  failureCount!: number
  httpStatus!: number
  lastError!: string
}
