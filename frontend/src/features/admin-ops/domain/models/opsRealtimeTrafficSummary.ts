import { OpsRateSummary } from './opsRateSummary'

export class OpsRealtimeTrafficSummary {
  window!: string
  startTime!: string
  endTime!: string
  platform!: string
  groupId!: number
  qps!: OpsRateSummary
  tps!: OpsRateSummary
}
