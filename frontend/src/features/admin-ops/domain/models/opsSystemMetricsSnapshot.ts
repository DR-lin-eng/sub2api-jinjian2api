export class OpsSystemMetricsSnapshot {
  id!: number
  createdAt!: string
  windowMinutes!: number
  cpuUsagePercent!: number
  memoryUsedMb!: number
  memoryTotalMb!: number
  memoryUsagePercent!: number
  dbOk!: boolean
  redisOk!: boolean
  dbMaxOpenConns!: number
  redisPoolSize!: number
  redisConnTotal!: number
  redisConnIdle!: number
  dbConnActive!: number
  dbConnIdle!: number
  dbConnWaiting!: number
  goroutineCount!: number
  concurrencyQueueDepth!: number
  accountSwitchCount!: number
}
