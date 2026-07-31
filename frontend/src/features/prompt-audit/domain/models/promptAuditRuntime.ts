import type { PromptAuditMode } from '@/features/prompt-audit/enums/promptAuditMode'
import type { PromptQueueStats } from './promptQueueStats'
import type { PromptGuardMetrics } from './promptGuardMetrics'
import type { PromptProbeResult } from './promptProbeResult'

export class PromptAuditRuntime {
  processStatus!: string
  effectiveMode!: PromptAuditMode
  expectedConfigVersion!: number
  activeConfigVersion!: number
  configLoadedAt?: string
  configLoadError?: string
  workerTotal!: number
  workerActive!: number
  workerHeartbeatAt?: string
  queueCapacity!: number
  queue!: PromptQueueStats
  processedTotal!: number
  failedTotal!: number
  enqueuedTotal!: number
  droppedTotal!: number
  lastProcessedAt?: string
  lastErrorCode?: string
  lastErrorMessage?: string
  databaseStatus!: string
  redisStatus!: string
  endpoints!: Record<string, PromptProbeResult>
  guardMetrics!: PromptGuardMetrics
}
