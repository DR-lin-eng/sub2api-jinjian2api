import { OpsLatencyHistogramBucket } from './opsLatencyHistogramBucket'

export class OpsLatencyHistogramResponse {
  startTime!: string
  endTime!: string
  platform!: string
  groupId!: number
  totalRequests!: number
  buckets!: OpsLatencyHistogramBucket[]
}
