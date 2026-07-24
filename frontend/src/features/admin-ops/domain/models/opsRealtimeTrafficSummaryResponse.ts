import { OpsRealtimeTrafficSummary } from './opsRealtimeTrafficSummary'

export class OpsRealtimeTrafficSummaryResponse {
  enabled!: boolean
  summary?: OpsRealtimeTrafficSummary
  timestamp!: string
}
