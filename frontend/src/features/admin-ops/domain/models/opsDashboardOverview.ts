import { OpsPercentiles } from './opsPercentiles'
import { OpsSystemMetricsSnapshot } from './opsSystemMetricsSnapshot'
import { OpsJobHeartbeat } from './opsJobHeartbeat'

export class OpsDashboardOverview {
  startTime!: string
  endTime!: string
  platform!: string
  groupId!: number
  healthScore!: number
  systemMetrics?: OpsSystemMetricsSnapshot
  jobHeartbeats!: OpsJobHeartbeat[]
  successCount!: number
  errorCountTotal!: number
  businessLimitedCount!: number
  errorCountSla!: number
  requestCountTotal!: number
  requestCountSla!: number
  tokenConsumed!: number
  sla!: number
  errorRate!: number
  upstreamErrorRate!: number
  upstreamErrorCountExcl429529!: number
  upstream429Count!: number
  upstream529Count!: number
  qpsCurrent!: number
  qpsPeak!: number
  qpsAvg!: number
  tpsCurrent!: number
  tpsPeak!: number
  tpsAvg!: number
  duration!: OpsPercentiles
  ttft!: OpsPercentiles
}
