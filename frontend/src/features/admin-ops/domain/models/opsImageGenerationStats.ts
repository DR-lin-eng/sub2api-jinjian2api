import { OpsImageGenerationRealtime } from './opsImageGenerationRealtime'
import { OpsImageGenerationResolutionStats } from './opsImageGenerationResolutionStats'

export class OpsImageGenerationStats {
  startTime!: string
  endTime!: string
  platform!: string
  groupId!: number
  requestCount!: number
  imageCount!: number
  requestsPerMinute!: number
  avgDurationMs!: number
  p95DurationMs!: number
  maxDurationMs!: number
  averageConcurrent!: number
  peakConcurrent!: number
  realtime!: OpsImageGenerationRealtime
  byResolution!: OpsImageGenerationResolutionStats[]
}
