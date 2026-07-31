export class OpsRuntimeLogConfig {
  level!: 'debug' | 'info' | 'warn' | 'error'
  enableSampling!: boolean
  samplingInitial!: number
  samplingThereafter!: number
  caller!: boolean
  stacktraceLevel!: 'none' | 'error' | 'fatal'
  retentionDays!: number
  redisOnly!: boolean
  source!: string
  updatedAt!: string
  updatedByUserId!: number
}
