export class OpsSystemLogSinkHealth {
  queueDepth!: number
  queueCapacity!: number
  droppedCount!: number
  writeFailedCount!: number
  writtenCount!: number
  avgWriteDelayMs!: number
  lastError!: string
}
