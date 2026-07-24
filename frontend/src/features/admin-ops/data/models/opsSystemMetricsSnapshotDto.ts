import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsSystemMetricsSnapshot } from '@/features/admin-ops/domain/models/opsSystemMetricsSnapshot'

export class OpsSystemMetricsSnapshotDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'window_minutes' }) @Transform(({ value }) => value ?? 0) windowMinutes!: number
  @Expose({ name: 'cpu_usage_percent' }) @Transform(({ value }) => value ?? 0) cpuUsagePercent!: number
  @Expose({ name: 'memory_used_mb' }) @Transform(({ value }) => value ?? 0) memoryUsedMb!: number
  @Expose({ name: 'memory_total_mb' }) @Transform(({ value }) => value ?? 0) memoryTotalMb!: number
  @Expose({ name: 'memory_usage_percent' }) @Transform(({ value }) => value ?? 0) memoryUsagePercent!: number
  @Expose({ name: 'db_ok' }) @Transform(({ value }) => value ?? false) dbOk!: boolean
  @Expose({ name: 'redis_ok' }) @Transform(({ value }) => value ?? false) redisOk!: boolean
  @Expose({ name: 'db_max_open_conns' }) @Transform(({ value }) => value ?? 0) dbMaxOpenConns!: number
  @Expose({ name: 'redis_pool_size' }) @Transform(({ value }) => value ?? 0) redisPoolSize!: number
  @Expose({ name: 'redis_conn_total' }) @Transform(({ value }) => value ?? 0) redisConnTotal!: number
  @Expose({ name: 'redis_conn_idle' }) @Transform(({ value }) => value ?? 0) redisConnIdle!: number
  @Expose({ name: 'db_conn_active' }) @Transform(({ value }) => value ?? 0) dbConnActive!: number
  @Expose({ name: 'db_conn_idle' }) @Transform(({ value }) => value ?? 0) dbConnIdle!: number
  @Expose({ name: 'db_conn_waiting' }) @Transform(({ value }) => value ?? 0) dbConnWaiting!: number
  @Expose({ name: 'goroutine_count' }) @Transform(({ value }) => value ?? 0) goroutineCount!: number
  @Expose({ name: 'concurrency_queue_depth' }) @Transform(({ value }) => value ?? 0) concurrencyQueueDepth!: number
  @Expose({ name: 'account_switch_count' }) @Transform(({ value }) => value ?? 0) accountSwitchCount!: number

  static fromJson(json: unknown): OpsSystemMetricsSnapshotDto {
    return plainToInstance(OpsSystemMetricsSnapshotDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsSystemMetricsSnapshot {
    const e = new OpsSystemMetricsSnapshot()
    e.id = this.id
    e.createdAt = this.createdAt
    e.windowMinutes = this.windowMinutes
    e.cpuUsagePercent = this.cpuUsagePercent
    e.memoryUsedMb = this.memoryUsedMb
    e.memoryTotalMb = this.memoryTotalMb
    e.memoryUsagePercent = this.memoryUsagePercent
    e.dbOk = this.dbOk
    e.redisOk = this.redisOk
    e.dbMaxOpenConns = this.dbMaxOpenConns
    e.redisPoolSize = this.redisPoolSize
    e.redisConnTotal = this.redisConnTotal
    e.redisConnIdle = this.redisConnIdle
    e.dbConnActive = this.dbConnActive
    e.dbConnIdle = this.dbConnIdle
    e.dbConnWaiting = this.dbConnWaiting
    e.goroutineCount = this.goroutineCount
    e.concurrencyQueueDepth = this.concurrencyQueueDepth
    e.accountSwitchCount = this.accountSwitchCount
    return e
  }
}
