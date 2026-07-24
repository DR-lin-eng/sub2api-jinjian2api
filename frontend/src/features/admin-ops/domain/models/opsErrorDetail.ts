import { OpsErrorLog } from './opsErrorLog'

export class OpsErrorDetail extends OpsErrorLog {
  errorBody!: string
  upstreamStatusCode!: number
  upstreamErrorMessage!: string
  upstreamErrorDetail!: string
  upstreamErrors!: string
  authLatencyMs!: number
  routingLatencyMs!: number
  upstreamLatencyMs!: number
  responseLatencyMs!: number
  timeToFirstTokenMs!: number
  isBusinessLimited!: boolean
  apiKeyPrefix!: string
}
