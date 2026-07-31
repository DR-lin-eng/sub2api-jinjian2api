import type { ProxyQualityCheckItem } from './proxyQualityCheckItem'

export class ProxyQualityCheckResult {
  proxyId!: number
  score!: number
  grade!: string
  summary!: string
  exitIp?: string
  country?: string
  countryCode?: string
  baseLatencyMs?: number
  passedCount!: number
  warnCount!: number
  failedCount!: number
  challengeCount!: number
  checkedAt!: number
  items!: ProxyQualityCheckItem[]
}
