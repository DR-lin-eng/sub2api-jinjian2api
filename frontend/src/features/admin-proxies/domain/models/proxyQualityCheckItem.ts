export class ProxyQualityCheckItem {
  target!: string
  status!: 'pass' | 'warn' | 'fail' | 'challenge'
  httpStatus?: number
  latencyMs?: number
  message?: string
  cfRay?: string
}
