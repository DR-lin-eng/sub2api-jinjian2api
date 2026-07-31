export class PromptGuardMetrics {
  total!: number
  allowed!: number
  flagged!: number
  blocked!: number
  unavailable!: number
  invalid!: number
  timeouts!: number
  failovers!: number
  bulkheadFull!: number
  recordFailed!: number
  latencyAvgMs?: number
  latencyP50Ms?: number
  latencyP95Ms?: number
  latencyP99Ms?: number
  latencyMaxMs?: number
}
