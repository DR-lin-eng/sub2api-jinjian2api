import { OpsDashboardOverview } from './opsDashboardOverview'
import { OpsThroughputTrendResponse } from './opsThroughputTrendResponse'
import { OpsLatencyHistogramResponse } from './opsLatencyHistogramResponse'
import { OpsErrorTrendResponse } from './opsErrorTrendResponse'
import { OpsErrorDistributionResponse } from './opsErrorDistributionResponse'

export class OpsDashboardSnapshotV2 {
  generatedAt!: string
  overview!: OpsDashboardOverview
  throughputTrend?: OpsThroughputTrendResponse
  latencyHistogram?: OpsLatencyHistogramResponse
  errorTrend?: OpsErrorTrendResponse
  errorDistribution?: OpsErrorDistributionResponse
}
